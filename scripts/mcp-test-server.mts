// Local test harness for the actual REST + MCP endpoints, without Next.js compilation.
import { createServer } from 'node:http'
import { handleEndpoints } from 'payload'
import config from '../src/payload.config'
if (process.env.ALLOW_MCP_TESTS !== 'true') throw new Error('Only run against an explicitly disposable local database with ALLOW_MCP_TESTS=true.')
const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost','127.0.0.1'].includes(database.hostname)) throw new Error('The test harness requires a localhost database.')
const port = Number(process.env.MCP_TEST_PORT || 3002)
createServer(async (input, output) => {
  try {
    const chunks: Buffer[] = []
    for await (const chunk of input) chunks.push(Buffer.from(chunk))
    const headers = new Headers()
    for (const [key,value] of Object.entries(input.headers)) if(value) headers.set(key,Array.isArray(value)?value.join(','):value)
    const request = new Request(`http://127.0.0.1:${port}${input.url}`, { method: input.method, headers,
      ...(!['GET','HEAD'].includes(input.method || '') ? { body: Buffer.concat(chunks) } : {}) })
    const response = await handleEndpoints({ config, request })
    output.writeHead(response.status,Object.fromEntries(response.headers))
    if(response.body) { const reader=response.body.getReader();while(true){const {done,value}=await reader.read();if(done)break;output.write(Buffer.from(value))} }
    output.end()
  } catch { output.writeHead(500);output.end('Local endpoint test error. Inspect the server log.') }
}).listen(port,'127.0.0.1',()=>console.log(`Disposable MCP API test server on http://127.0.0.1:${port}`))

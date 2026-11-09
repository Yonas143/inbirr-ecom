import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'

const origin = process.env.MCP_TEST_URL || 'http://127.0.0.1:3000'
const url = new URL(origin)
if (process.env.ALLOW_MCP_TESTS !== 'true' || !['localhost', '127.0.0.1'].includes(url.hostname)) {
  throw new Error(
    'Set ALLOW_MCP_TESTS=true and MCP_TEST_URL to an explicitly disposable localhost store.',
  )
}
const suffix = randomBytes(5).toString('hex')
const password = randomBytes(24).toString('hex')
let token = ''
async function api(path: string, method = 'GET', body?: unknown, auth = token) {
  const response = await fetch(origin + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `JWT ${auth}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30000),
  })
  const data = await response.json().catch(() => ({}))
  return { status: response.status, data }
}
const admin = await api(
  '/api/users',
  'POST',
  { email: `mcp-test-${suffix}@example.invalid`, password, name: 'MCP integration fixture' },
  '',
)
assert.equal(
  admin.status,
  201,
  'Create administrator on a fresh disposable database; existing stores need a separate fixture setup.',
)
const login = await api(
  '/api/users/login',
  'POST',
  { email: `mcp-test-${suffix}@example.invalid`, password },
  '',
)
token = login.data.token
assert.ok(token)
assert.ok(
  login.data.user.roles.includes('admin'),
  'Run this test on a fresh DB so the first fixture becomes admin.',
)

async function key(label: string, permissions: Record<string, unknown> = {}) {
  const secret = randomBytes(32).toString('hex')
  const result = await api('/api/payload-mcp-api-keys', 'POST', {
    label,
    enableAPIKey: true,
    apiKey: secret,
    ...permissions,
  })
  assert.equal(result.status, 201, `Key creation failed: ${JSON.stringify(result.data.errors)}`)
  return { id: result.data.doc.id, secret }
}
async function connect(secret: string) {
  const client = new Client({ name: 'inbirr-integration-test', version: '0.1.0' })
  await client.connect(
    new StreamableHTTPClientTransport(new URL('/api/mcp', origin), {
      requestInit: { headers: { Authorization: `Bearer ${secret}` } },
    }),
  )
  return client
}
const unauthenticated = await fetch(origin + '/api/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
})
assert.equal(unauthenticated.status, 401)
console.log('PASS unauthenticated MCP requests denied')
const readKey = await key('Read-only test', { products: { find: true } })
const reader = await connect(readKey.secret)
const readTools = await reader.listTools()
assert.ok(readTools.tools.some((tool) => tool.name === 'findProducts'))
assert.ok(!readTools.tools.some((tool) => tool.name === 'createProductDraft'))
assert.ok(
  !readTools.tools.some((tool) =>
    /delete|refund|login|setProductPrice|publishProduct/.test(tool.name),
  ),
)
console.log('PASS read-only key has no mutation capabilities')
const writerKey = await key('Draft creation test', {
  products: { find: true },
  'payload-mcp-tool': { createProductDraft: true, uploadProductImage: true },
})
const writer = await connect(writerKey.secret)
const tools = await writer.listTools()
assert.ok(tools.tools.some((tool) => tool.name === 'createProductDraft'))
assert.ok(!tools.tools.some((tool) => tool.name === 'publishProduct'))
const result = await writer.callTool({
  name: 'createProductDraft',
  arguments: { title: 'MCP fixture product', slug: `mcp-fixture-${suffix}` },
})
assert.ok(!result.isError, JSON.stringify(result))
const product = JSON.parse((result.content as Array<{ text: string }>)[0].text)
assert.equal(product.status, 'draft')
const publicRead = await api(`/api/products/${product.id}`, 'GET', undefined, '')
assert.equal(publicRead.status, 404)
const duplicate = await writer.callTool({
  name: 'createProductDraft',
  arguments: { title: 'Retry draft', slug: `mcp-fixture-${suffix}` },
})
assert.equal(JSON.parse((duplicate.content as Array<{ text: string }>)[0].text).id, product.id)
console.log('PASS draft creation, slug retry, and draft privacy')

let deniedDirectWrite = false
try { const forbidden = await reader.callTool({ name:'publishProduct', arguments:{productId:product.id,confirmed:true} }); deniedDirectWrite = Boolean(forbidden.isError) } catch { deniedDirectWrite = true }
assert.ok(deniedDirectWrite, 'Direct invocation must respect tool permissions.')
const managerKey = await key('Approved catalog changes', { 'payload-mcp-tool': { setProductPrice:true, setProductInventory:true, publishProduct:true } })
const manager = await connect(managerKey.secret)
for (const [name, args] of [
  ['setProductPrice', { productId: product.id, currency:'USD', amountMinor:1250, confirmed:true }],
  ['setProductInventory', { productId: product.id, quantity:3, confirmed:true }],
  ['publishProduct', { productId: product.id, confirmed:true }],
] as const) {
  const changed = await manager.callTool({ name, arguments:args })
  assert.ok(!changed.isError, JSON.stringify(changed))
}
const published = await api(`/api/products/${product.id}`,'GET',undefined,'')
assert.equal(published.status,200)
assert.equal(published.data.priceInUSD,1250)
assert.equal(published.data.inventory,3)
assert.equal(published.data._status,'published')
await manager.close()
console.log('PASS direct write denial, USD price, inventory, and owner-authorized publication')

// Upload a tiny known PNG through MCP; no URLs, network fetching, or credentials in image data.
const image = await writer.callTool({
  name: 'uploadProductImage',
  arguments: {
    filename: `mcp-fixture-${suffix}.png`,
    mimeType: 'image/png',
    alt: 'MCP test pixel',
    base64:
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aVWsAAAAASUVORK5CYII=',
  },
})
assert.ok(!image.isError, JSON.stringify(image))
console.log('PASS image upload through MCP')
const audits = await api('/api/mcp-audit?limit=10')
assert.ok(
  audits.data.docs.some((entry: { action: string }) => entry.action === 'create-product-draft'),
)
assert.ok(
  audits.data.docs.some((entry: { action: string }) => entry.action === 'upload-product-image'),
)
console.log('PASS completed mutations have audit records')
const customer = await api('/api/users', 'POST', {
  email: `customer-${suffix}@example.invalid`,
  password,
  name: 'Customer fixture',
  roles: ['customer'],
})
assert.equal(customer.status, 201)
const customerLogin = await api(
  '/api/users/login',
  'POST',
  { email: `customer-${suffix}@example.invalid`, password },
  '',
)
const denied = await api(
  '/api/payload-mcp-api-keys',
  'POST',
  { label: 'Forbidden customer key' },
  customerLogin.data.token,
)
assert.equal(denied.status, 403)
console.log('PASS customers cannot issue agent credentials')
await api(`/api/payload-mcp-api-keys/${writerKey.id}`, 'PATCH', { enableAPIKey: false })
await assert.rejects(connect(writerKey.secret))
console.log('PASS disabled key rejected immediately')
await api(`/api/payload-mcp-api-keys/${readKey.id}`, 'PATCH', {
  expiresAt: new Date(Date.now() - 60000).toISOString(),
})
await assert.rejects(connect(readKey.secret))
console.log('PASS expired key rejected')
await reader.close()
await writer.close()
console.log(
  'MCP integration checks completed on the disposable local database. Fixtures were retained for inspection.',
)

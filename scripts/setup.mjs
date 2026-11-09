import { randomBytes } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
const template = await readFile(new URL('../.env.example', import.meta.url), 'utf8')
const env = template.replace(/^PAYLOAD_SECRET=$/m, `PAYLOAD_SECRET=${randomBytes(32).toString('hex')}`).replace(/^PREVIEW_SECRET=$/m, `PREVIEW_SECRET=${randomBytes(32).toString('hex')}`)
try {
  await writeFile(new URL('../.env', import.meta.url), env, { flag: 'wx', mode: 0o600 })
  console.log('Created .env with fresh secrets. Start Postgres with docker compose up -d, then pnpm dev.')
} catch (error) {
  if (error.code !== 'EEXIST') throw error
  console.log('.env already exists; left it unchanged.')
}

import assert from 'node:assert/strict'
import test from 'node:test'
import type { PayloadRequest } from 'payload'
import { assertStoreManager, commerceTools, decodeImage } from '../../src/mcp/tools'
import { checkRole } from '../../src/access/utilities'

test('MCP credentials and customers cannot impersonate store managers', () => {
  for (const user of [
    null,
    { collection: 'payload-mcp-api-keys' },
    { collection: 'users', roles: ['customer'] },
    { collection: 'payload-mcp-api-keys', roles: ['admin'] },
  ]) {
    assert.equal(checkRole(['admin'], user), false)
    assert.throws(() => assertStoreManager({ user } as PayloadRequest))
  }
})
test('a store administrator can use permitted tools', () => {
  assert.doesNotThrow(() =>
    assertStoreManager({ user: { collection: 'users', roles: ['admin'] } } as PayloadRequest),
  )
})
test('tools reject mutation without explicit confirmation before accessing the DB', async () => {
  const publish = commerceTools.find((tool) => tool.name === 'publishProduct')!
  await assert.rejects(
    publish.handler({ productId: 1, confirmed: false }, {
      user: { collection: 'users', roles: ['admin'] },
    } as PayloadRequest),
  )
})
test('image upload rejects spoofed, malformed and oversized image bytes', () => {
  assert.throws(() => decodeImage(Buffer.from('<svg/>').toString('base64'), 'image/png'))
  assert.throws(() => decodeImage('%%%%', 'image/jpeg'))
  assert.throws(() => decodeImage('A'.repeat(2800001), 'image/webp'))
})

import type { Payload, PayloadRequest } from 'payload'
export async function seed({ payload, req }: { payload: Payload; req: PayloadRequest }) {
 for (const [title, slug] of [['Studio Tote','studio-tote'],['Everyday Cup','everyday-cup']]) {
   const existing = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, req, overrideAccess: false })
   if (!existing.docs.length) await payload.create({ collection: 'products', req, overrideAccess: false, data: { title, slug, inventory: 0, priceInUSDEnabled: false, _status: 'draft' } })
 }
}

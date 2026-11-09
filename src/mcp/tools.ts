import { checkRole } from '@/access/utilities'
import type { PayloadRequest } from 'payload'
import { z } from 'zod'

const id = z.number().int().positive()
const slug = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const confirmed = z
  .literal(true)
  .describe('Set true only after the store owner explicitly authorizes this change.')

export function assertStoreManager(req: PayloadRequest) {
  if (!checkRole(['admin'], req.user)) throw new Error('Store-manager access is required.')
}

function textDescription(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            { type: 'text', version: 1, format: 0, detail: 0, mode: 'normal', style: '', text },
          ],
        },
      ],
    },
  }
}

async function audit(req: PayloadRequest, action: string, documentID: number) {
  await req.payload.create({
    collection: 'mcp-audit',
    req,
    overrideAccess: false,
    data: { action, actor: req.user!.id, documentID: String(documentID) },
  })
}

function tool<S extends z.ZodRawShape>(
  name: string,
  description: string,
  parameters: S,
  action: (args: z.infer<z.ZodObject<S>>, req: PayloadRequest) => Promise<unknown>,
) {
  return {
    name,
    description,
    parameters,
    handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
      assertStoreManager(req)
      const result = await action(z.object(parameters).strict().parse(args), req)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    },
  }
}

export function decodeImage(base64: string, mimeType: string) {
  if (base64.length > 2800000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64))
    throw new Error('Invalid or oversized base64 image.')
  const bytes = Buffer.from(base64, 'base64')
  if (!bytes.length || bytes.length > 2 * 1024 * 1024)
    throw new Error('Images must be between 1 byte and 2 MiB.')
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  const webp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
  if (!(
    (mimeType === 'image/png' && png) ||
    (mimeType === 'image/jpeg' && jpeg) ||
    (mimeType === 'image/webp' && webp)
  ))
    throw new Error('Image bytes do not match the declared format.')
  return bytes
}

export const commerceTools = [
  tool(
    'createProductDraft',
    'Create a simple product as a draft. Never publishes or invents price or stock. Reuse a slug to locate a previous draft after a lost response.',
    {
      title: z.string().min(1).max(180),
      slug,
      description: z.string().max(10000).optional(),
      inventory: z.number().int().min(0).max(1000000).default(0),
      priceMinor: z
        .number()
        .int()
        .min(0)
        .max(1000000000)
        .optional()
        .describe('Optional USD cents, e.g. 1250 means USD 12.50.'),
      mediaIds: z.array(id).max(12).default([]),
    },
    async (args, req) => {
      const existing = await req.payload.find({
        collection: 'products',
        req,
        overrideAccess: false,
        draft: true,
        where: { slug: { equals: args.slug } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length)
        return { id: existing.docs[0].id, status: existing.docs[0]._status, alreadyExists: true }
      const doc = await req.payload.create({
        collection: 'products',
        req,
        overrideAccess: false,
        draft: true,
        data: {
          title: args.title,
          slug: args.slug,
          _status: 'draft',
          enableVariants: false,
          inventory: args.inventory,
          priceInUSDEnabled: args.priceMinor !== undefined,
          ...(args.priceMinor !== undefined ? { priceInUSD: args.priceMinor } : {}),
          ...(args.description ? { description: textDescription(args.description) } : {}),
          gallery: args.mediaIds.map((image) => ({ image })),
        },
      })
      await audit(req, 'create-product-draft', doc.id)
      return { id: doc.id, title: doc.title, status: doc._status }
    },
  ),
  tool(
    'setProductInventory',
    'Set confirmed inventory for a simple product. Variant products must be edited through their variants.',
    {
      productId: id,
      quantity: z.number().int().min(0).max(1000000),
      confirmed,
    },
    async (args, req) => {
      const product = await req.payload.findByID({
        collection: 'products',
        id: args.productId,
        req,
        overrideAccess: false,
        depth: 0,
      })
      if (product.enableVariants)
        throw new Error('This is a variant product; update the specific variant in the admin.')
      const doc = await req.payload.update({
        collection: 'products',
        id: args.productId,
        req,
        overrideAccess: false,
        data: { inventory: args.quantity },
      })
      await audit(req, 'set-product-inventory', doc.id)
      return { id: doc.id, inventory: doc.inventory }
    },
  ),
  tool(
    'setProductPrice',
    'Set an owner-approved USD price for a simple product, in cents. Never converts ETB or infers a price.',
    {
      productId: id,
      currency: z.literal('USD'),
      amountMinor: z.number().int().min(1).max(1000000000),
      confirmed,
    },
    async (args, req) => {
      const product = await req.payload.findByID({
        collection: 'products',
        id: args.productId,
        req,
        overrideAccess: false,
        depth: 0,
      })
      if (product.enableVariants)
        throw new Error('This is a variant product; update the specific variant in the admin.')
      const doc = await req.payload.update({
        collection: 'products',
        id: args.productId,
        req,
        overrideAccess: false,
        data: { priceInUSD: args.amountMinor, priceInUSDEnabled: true },
      })
      await audit(req, 'set-product-price', doc.id)
      return { id: doc.id, currency: 'USD', amountMinor: doc.priceInUSD }
    },
  ),
  tool(
    'publishProduct',
    'Publish an existing draft only after explicit owner approval. Review the draft and images first.',
    { productId: id, confirmed },
    async (args, req) => {
      const doc = await req.payload.update({
        collection: 'products',
        id: args.productId,
        req,
        overrideAccess: false,
        data: { _status: 'published' },
      })
      await audit(req, 'publish-product', doc.id)
      return { id: doc.id, status: doc._status, path: `/products/${doc.slug}` }
    },
  ),
  tool(
    'uploadProductImage',
    'Upload an owner-provided PNG, JPEG or WebP, up to 2 MiB. Supply raw base64, not a data URL. Returns an ID for createProductDraft.mediaIds.',
    {
      filename: z
        .string()
        .min(1)
        .max(120)
        .regex(/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/i),
      mimeType: z.enum(['image/png', 'image/jpeg', 'image/webp']),
      base64: z.string().max(2800000),
      alt: z.string().min(1).max(500),
    },
    async (args, req) => {
      const data = decodeImage(args.base64, args.mimeType)
      const doc = await req.payload.create({
        collection: 'media',
        req,
        overrideAccess: false,
        data: { alt: args.alt },
        file: { data, mimetype: args.mimeType, name: args.filename, size: data.length },
      })
      await audit(req, 'upload-product-image', doc.id)
      return { id: doc.id, filename: doc.filename, url: doc.url }
    },
  ),
  tool(
    'listStoreOrders',
    'Read recent orders without access tokens or full customer details. Cannot change payment or fulfilment status.',
    {
      limit: z.number().int().min(1).max(25).default(10),
    },
    async (args, req) => {
      const result = await req.payload.find({
        collection: 'orders',
        req,
        overrideAccess: false,
        depth: 0,
        limit: args.limit,
        sort: '-createdAt',
        select: { status: true, amount: true, currency: true, createdAt: true },
      })
      return { orders: result.docs, total: result.totalDocs }
    },
  ),
]

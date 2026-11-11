# Store management

Use `/admin` to manage the store. The catalog starts empty, so sample text and artwork on the homepage are placeholders for your business.

## Catalog and stock

**Simple products:** create a product, set its title and slug, attach media, choose a category, and enter its price and inventory in Product Details. Leave the price disabled for an item that is shown for enquiries. Unpriced simple products display **Price on request** on the product page; keep them at zero stock until they are ready to sell.

**Variants:** define variant types and options, enable variants for the product, then set the price and inventory of each sellable variant. A product-level sorting price does not replace variant pricing. Test the shopper's selection, availability, and cart subtotal for each option you intend to sell.

**Publishing:** drafts stay out of the public catalog. Publish after checking the title, images, description, price, and stock. Open `/shop` in a signed-out browser and verify the product appears. Use product versions to review previous edits. Use Trash for products you want to remove while retaining a recovery option, and check any affected order references before permanent deletion.

**Media:** upload clear product images with descriptive alt text. A database record and the stored file are separate; backups should cover both. Avoid replacing a shared media file if other products still use it.

## Storefront content

- **Pages** stores CMS-managed content pages. Use the editor and preview before publishing.
- **Store header** and **Store footer** manage additional navigation links. The starter also has built-in navigation in its storefront components.
- The **homepage layout and hero** are code in [`src/app/(app)/page.tsx`](../src/app/%28app%29/page.tsx). Its product section reads from the published catalog. Change the source for new hero layouts and brand copy; publishing a CMS page called Home does not replace the starter homepage.

## Orders and transactions

Use **Orders** for order status and items, and **Transactions** to reconcile provider references and amounts. A cart is a shopping session, not a paid order. Confirm a payment using provider evidence and the application's order record. Do not infer payment success from a browser redirect, a screenshot, or a cart total.

The MCP tools can read order summaries, but fulfilment writes, refunds, and direct payment-status changes are intentionally unavailable through MCP. Use the admin for order management and your provider's tools for supported refund operations. Reconcile provider actions with your store records.

## Hand off an AI-assisted task

A clear request gives the assistant facts, an action, and a review boundary:

> Create a draft for Studio Tote, slug `studio-tote`. Use the supplied photo, 3 units of stock, and a price of USD 12.50. Show me the draft before publishing.

Give the assistant a draft-only key if it does not need to publish. See [MCP permissions and examples](mcp.md).

[Documentation index](README.md) · [Payments and email](payments.md)

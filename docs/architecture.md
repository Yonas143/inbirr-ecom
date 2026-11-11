# Architecture

Inbirr Ecom runs a storefront, administration interface, and API in one Next.js application. PostgreSQL holds store records. Media files live in local persistent storage or Vercel Blob. The payment provider processes payments, while the application stores transactions and orders.

## Entry points

- `/` and `/shop`: homepage and published catalog. The homepage queries published products at request time.
- `/products/<slug>`: product details, variants, and add-to-cart controls.
- `/checkout` and `/checkout/confirm-order`: payment flow and server-verified order confirmation.
- `/admin`: CMS-backed catalog, content, customer, and order management.
- `/account/ai`: setup instructions for signed-in store administrators.
- `/api`: CMS REST routes. `/api/mcp` is a Streamable HTTP MCP endpoint when enabled.

## Data and access

Products can have draft and published versions. Anonymous shoppers see published catalog entries; privileged writes use CMS collection permissions. Carts, orders, and transactions are distinct records. Order confirmation validates provider payment data before finalizing an order. A successful request to the webhook endpoint is not an order confirmation.

The MCP server authenticates an expiring or revocable key owned by a store admin. The key's capabilities restrict the exposed tools further. Custom tools run as that owner through the CMS access checks. Their write results are recorded in AI Activity; the mutation and audit insert are separate operations. MCP has no tool for raw SQL, code execution, payment status changes, or refunds. See [the MCP guide](mcp.md).

Coding agents work in a repository clone and follow [AGENTS.md](../AGENTS.md). Repository and deploy access remain separate from store MCP credentials.

## Source map

- [`src/app`](../src/app): storefront and admin routes and layouts.
- [`src/payload.config.ts`](../src/payload.config.ts): CMS, admin customization, and database adapter.
- [`src/plugins`](../src/plugins): ecommerce, Stripe, storage, forms, SEO, and MCP registration.
- [`src/collections`](../src/collections) and [`src/globals`](../src/globals): models and content settings.
- [`src/mcp`](../src/mcp): MCP capability configuration and custom commerce tools.
- [`src/migrations`](../src/migrations): committed Postgres migrations.
- [`src/components`](../src/components): reusable storefront and admin UI.

[Documentation index](README.md) · [Development](development.md)

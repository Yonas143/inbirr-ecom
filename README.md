# Inbirr Ecom Open Source

A self-hosted ecommerce starter with a Next.js storefront, shadcn/ui admin workspace, Postgres database, and an authenticated MCP server for conversational store management.

## Quick start

Requirements: Node **24.22.1+ (24.x)**, pnpm **10.12.1**, and Docker or your own Postgres 17 database.

```sh
git clone https://github.com/Yonas143/inbirr-ecom.git
cd inbirr-ecom
corepack enable
pnpm install --frozen-lockfile
pnpm setup
docker compose up -d
pnpm dev
```

Open `http://localhost:3000/admin` and create your own first administrator. There is no shared admin account or password. The storefront is at `/` and `/shop`. The first start creates the schema on your local development database; production uses migrations instead.

The dev/build scripts use Webpack for compatibility with the server-side MCP dependencies.

Configure store name and tagline with `NEXT_PUBLIC_STORE_NAME` and `NEXT_PUBLIC_STORE_TAGLINE`. Colors and layout are in `src/app/(app)/globals.css`; the included SVG illustration is reusable source artwork. Product images, descriptions, prices, and stock come from the admin or MCP tools. The catalog starts empty.

## Connect your AI

1. Sign in as a store administrator and open `/account/ai`.
2. Create an **AI Access Key**. Enable API access, set an optional expiry, and explicitly enable only the required capabilities. Every tool starts disabled.
3. Connect an MCP client to `https://YOUR-STORE/api/mcp` with `Authorization: Bearer YOUR_KEY` in the client's secret storage.
4. Try: “Create a product draft called Studio Tote, slug studio-tote. Do not publish it.”

The first release supports product and media lookup, draft creation, owner-approved publishing, simple-product USD prices and inventory, image uploads (PNG/JPEG/WebP, max 2 MiB), and read-only order summaries. Writes create an AI Activity record. Products also retain the CMS's version history.

See [MCP setup and permissions](docs/mcp.md) and [coding-agent workflows](docs/agents.md). Remote browser-based OAuth is **not implemented**; clients must support bearer headers. Store-management keys cannot execute shell commands, edit source, deploy, refund, delete products, or mark orders paid.

## Payments and launch status

- **Stripe:** the integration is included but requires your publishable key, secret key, and webhook signing secret. Run provider sandbox tests before launch.
- **Chapa:** not implemented. Optional `PAYMENT_GEO_ROUTING=true` routes Ethiopian visitors to a Chapa-unavailable screen, others to Stripe. Leave it **false** unless you are developing the adapter. No payment is silently routed to an unimplemented provider by default.
- **Currency:** the shipped catalog and MCP price tool support USD cents only. Add ETB schema and checkout support before implementing local-currency Chapa payments. No currency conversion is performed.
- **Email:** no production delivery provider is configured. Configure delivery and verify receipts and password resets before launch.
- Shipping charges, taxes, returns, legal copy, actual stock, and production payment/fulfilment tests are store-owner responsibilities. This is an early starter, not a claim of production certification.

## Development checks

```sh
pnpm test:unit
pnpm exec tsc --noEmit
pnpm build
```

A local-only integration test is available with a running **disposable** development store:

```sh
ALLOW_MCP_TESTS=true MCP_TEST_URL=http://127.0.0.1:3000 pnpm test:mcp
```

It creates a temporary administrator, customer, draft product, and API keys on that database. Do not run it against a live store. It tests authentication, tool permission restrictions, draft creation, audit recording, and key revocation.

Optional demo seeding requires an administrator and `ENABLE_DEMO_SEED=true` in development. `POST /next/seed` adds two draft products idempotently; it does not clear data or create demo orders/users. The route is always disabled in production.

## Deployment

See [deployment](docs/deployment.md). Use your own database, media storage, and credentials. Secrets belong in host environment variables. Local filesystem uploads do not persist on Vercel; configure Vercel Blob there. No hosted database, cloud project or deployment belongs to this starter.

## License and upstream

MIT; see [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md). The backend is built on the MIT-licensed Payload ecommerce template. UI branding is Inbirr Ecom; framework imports, API identifiers, and required copyright notices retain upstream names.

Contributions: [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md).

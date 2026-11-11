# Configuration reference

Run `pnpm run setup` once for local development. For hosting, copy the values into the host's environment settings. Give local, staging, and production their own database, media storage, and secrets.

## Application and database

- `PAYLOAD_SECRET`: required server secret used by the CMS. Generate a fresh value per environment. Rotating it can invalidate existing authentication and keys; plan a reconnect.
- `PREVIEW_SECRET`: secret for the draft-preview route. Generate a separate value and keep preview links private.
- `DATABASE_URL`: PostgreSQL connection string for the target database. The template points to the loopback-only Compose service. Supply your own database credentials in hosted environments.
- `DATABASE_SSL_CA`: optional trusted Postgres root certificate as PEM text. When set, certificate verification is enabled with that CA. Preserve line breaks when entering the value.
- `DATABASE_PUSH`: `true` in the local template. Set to `false` when using migrations. Production disables schema push regardless of this value.
- `NEXT_PUBLIC_SERVER_URL`: the store origin, including scheme and port if needed. Use the real HTTPS origin on a hosted store. Keep the configured origin consistent with preview URLs and your domain.

## Public identity

- `NEXT_PUBLIC_STORE_NAME`: display name used by the shared brand configuration; defaults to `Inbirr Ecom`.
- `NEXT_PUBLIC_STORE_TAGLINE`: tagline used by the shared brand configuration; defaults to `Open commerce. Your way.`

The shared values are defined in [`src/brand.ts`](../src/brand.ts). Replace starter-specific homepage and metadata copy in the storefront when creating your own brand. Theme styles are in [`globals.css`](../src/app/%28app%29/globals.css); hero artwork and the favicon are under [`public`](../public). Changes to `NEXT_PUBLIC_*` values need a rebuild for a deployed site.

## Media and AI

- `BLOB_READ_WRITE_TOKEN`: enables the Vercel Blob media adapter when supplied. Leave blank for local filesystem uploads under `public/media`. Use separate storage for staging and production.
- `MCP_ENABLED`: `true` in the generated local environment. Set to `false` to keep the MCP endpoint disabled; key schema is preserved. When enabled, every key still requires a store-admin owner and explicit capabilities.
- `ENABLE_DEMO_SEED`: defaults to `false`. Enables an admin-only development endpoint at `POST /next/seed` that adds two draft products without clearing records. The endpoint is disabled in production.

## Payments

- `STRIPE_SECRET_KEY`: server-only Stripe secret key from the selected environment.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: matching browser publishable key. Leave blank until you are configuring Stripe.
- `STRIPE_WEBHOOKS_SIGNING_SECRET`: server-only signing secret for the webhook listener that sends events to this store. The local CLI listener and a deployed webhook have different secrets.
- `PAYMENT_GEO_ROUTING`: defaults to `false`. When `true`, an Ethiopian country header selects the Chapa unavailable screen. Leave it disabled for a Stripe-only store. Chapa and ETB checkout are unfinished.

Prices use USD integer cents in the API and MCP. An amount of `1250` means **USD 12.50**. Configuration does not convert currencies or implement additional price fields.

Only publishable keys and intentionally public settings belong in `NEXT_PUBLIC_*`. Do not commit database passwords, server keys, webhook secrets, access tokens, or production data. See [payments](payments.md) and [deployment](deployment.md) for setup sequences.

[Documentation index](README.md)

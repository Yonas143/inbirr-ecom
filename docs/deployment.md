# Deployment

Use your own Postgres database. Run `pnpm setup` locally to generate fresh secrets; copy those secrets into your host's environment configuration, never into source control. Set `NEXT_PUBLIC_SERVER_URL` to the real HTTPS store origin.

## Database

Development (`pnpm dev`) uses schema push against your development DB. Production disables push. Against a dedicated staging DB, run `pnpm payload migrate` with the target `DATABASE_URL`, inspect the result, then build and deploy. Do not run development schema push against production. Back up a live DB before migrations.

For Supabase, use the appropriate pooler connection string and a dedicated database role with only the application's schema privileges. Keep credentials server-side. Configure `DATABASE_SSL_CA` with the provider's root certificate; do not disable certificate verification. Keep app tables in a non-exposed schema or protect Data API access with RLS and appropriate grants; this starter does not configure Supabase policies for your account.

## Media and email

Local uploads use `public/media`. On serverless hosts such as Vercel, provision your own Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`. Test image upload and retrieval after deployment. For other hosts, use persistent storage or configure a supported storage adapter.

Email delivery is not configured. Add an email adapter and verify order messages and password resets with your own domain before launch.

## Vercel

Import your own repository, set Node 24.x and environment variables, and build with `pnpm build`. Never commit `.vercel`, `.env`, connection tokens, a database dump or real customer data. Test migrations on staging before directing the deployment at your live DB. Stripe needs API keys and a reachable webhook; Chapa is not implemented. MCP uses per-user bearer keys over HTTPS and is opt-in with `MCP_ENABLED=true`.

Start with a private staging store, complete provider sandbox and permission checks, then publish your own storefront. Publishing this source repository does not deploy a store or create cloud resources.

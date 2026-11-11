# Deployment

Deploy one store per installation. Use a staging database and separate credentials before exposing a production store. Protect staging and complete administrator setup before making a fresh store public.

## Prepare the target

1. Create an empty PostgreSQL database, and give the application its own connection credentials. Provision persistent media storage.
2. Configure the [environment variables](configuration.md). Generate unique application and preview secrets. Set `NEXT_PUBLIC_SERVER_URL` to the deployed HTTPS origin and `DATABASE_PUSH=false`.
3. From an environment with network access to the target database, apply the committed migrations before building the app. Confirm the target database and take a backup before migrating any existing store.

```sh
pnpm install --frozen-lockfile
pnpm exec cross-env NODE_ENV=production pnpm payload migrate
pnpm build
```

The migration command reads your environment, including `DATABASE_URL`; it does not provision the database. Running the build alone does not apply migrations. Use the same code revision for migrations and the application.

## Deploy to Vercel

1. Import your own repository and configure Node 24.x matching the repository's engine requirement. Use `pnpm build` as the build command.
2. Add production and preview environment values separately. Point preview builds to staging, never your live database. Use an [appropriate commercial plan](https://vercel.com/docs/plans/hobby) if you run a business.
3. Connect [Vercel Blob](https://vercel.com/docs/vercel-blob/using-blob-sdk) and set `BLOB_READ_WRITE_TOKEN`. The built-in adapter serves product media; do not put private customer documents in that media collection. Filesystem uploads are unsuitable for persistent storage on Vercel.
4. Apply migrations from your trusted deploy environment and deploy. Add the domain, verify HTTPS, and rebuild with the final `NEXT_PUBLIC_SERVER_URL` if it changes.
5. Sign in to `/admin`, publish a test product, upload and reload its image, and verify the public storefront and cart. Complete the [launch checks](operations.md#launch-checklist) before taking orders.

## Run on a Node host

Run `pnpm start` after the build and migration steps. Put the server behind an HTTPS reverse proxy, run it under a supervised process manager, and give it a persistent writable `public/media` directory if you use local uploads. Keep Postgres private and back up the database and files separately. On multiple app instances, use shared durable media storage so every instance can serve an uploaded image.

## Use Supabase as PostgreSQL

This integration uses a Postgres connection string; the store's users and sessions still belong to the CMS. Copy a [connection string suited to your network and workload](https://supabase.com/docs/guides/database/connecting-to-postgres). Verify database reachability and certificate validation from the migration runner and the deployed app. Use `DATABASE_SSL_CA` if your setup needs an explicit trusted CA.

The bundled migrations use the `public` schema. They do not configure Supabase Data API permissions for your account. Review exposure, table grants, and RLS before adding customer data; if you do not use the Data API, disable it or restrict access to the application tables. See [securing Supabase data](https://supabase.com/docs/guides/database/secure-data). Use a dedicated app role with appropriate privileges, and separate migration credentials where practical.

## Updates and rollback

Build and test the revision against staging first. Back up the target database and media before changing the schema. Keep the previous application revision available and check schema compatibility before rolling back code. A code rollback does not undo a migration or restore deleted data. Rehearse recovery against an isolated environment before relying on it.

[Documentation index](README.md) · [Troubleshooting](troubleshooting.md)

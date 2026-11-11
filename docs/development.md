# Development

Start with [local setup](getting-started.md), then read [AGENTS.md](../AGENTS.md) and the [architecture guide](architecture.md). The scripts use Webpack for Next.js because the server-side MCP dependencies are externalized. Keep Node and pnpm versions aligned with `package.json` and preserve the lockfile.

## Database workflows

Use one of these approaches on a disposable development database:

- **Schema push:** leave `DATABASE_PUSH=true` and run `pnpm dev`. This is useful for iterating on models against local data.
- **Migrations:** set `DATABASE_PUSH=false` and apply committed migrations to a fresh database. This is the workflow used by CI and the one to rehearse before a release.

```sh
pnpm exec cross-env NODE_ENV=production pnpm payload migrate
```

After a schema change, generate and review the migration against your development configuration, then test it on a separate fresh database. Generate the admin import map when component registrations change and regenerate types after modifying collections or globals.

```sh
pnpm payload migrate:create describe_change
pnpm generate:types
pnpm generate:importmap
```

Commit generated files alongside the changes that require them. A generated migration still needs review; do not apply it directly to production to see what happens.

## Verification commands

```sh
pnpm test:unit
pnpm exec tsc --noEmit
pnpm build
pnpm check:public
```

The unit suite covers payment routing and MCP permissions/input validation. The public-source check scans tracked paths and common secret patterns; it is a safeguard, not proof that all sensitive content is absent. The build may read the database, so provide a reachable database with the expected schema. If a dev server is running in the same checkout, use `NEXT_DIST_DIR=.next-production` for a separate build output.

### MCP integration tests

Point the test at a fresh, disposable local database with migrations applied and MCP enabled. The test creates the first administrator, a customer, access keys, a product, and image/audit fixtures. It publishes a fixture product and leaves records for inspection. It refuses non-loopback URLs and requires an explicit opt-in.

With the app running locally:

```sh
pnpm exec cross-env ALLOW_MCP_TESTS=true MCP_TEST_URL=http://127.0.0.1:3000 pnpm test:mcp
```

To use the lightweight API harness used by CI, first set `DATABASE_PUSH=false` in the disposable store's environment and apply migrations. Start this in its own terminal:

```sh
pnpm exec cross-env ALLOW_MCP_TESTS=true node --env-file=.env --import=tsx/esm scripts/mcp-test-server.mts
```

The harness binds to loopback on port 3002. Run the integration command with `MCP_TEST_URL=http://127.0.0.1:3002`. The harness is for tests only. Use a new disposable database for subsequent runs rather than overwriting an existing store's users or data.

### Browser checks

The repository includes a Playwright storefront smoke test, separate from CI. Before running it, set `use.baseURL` in `playwright.config.ts` to the same local origin as `webServer.url` (the sample `baseURL` is commented out). Install the configured Chromium browser with `pnpm exec playwright install chromium`, then run `pnpm test:e2e` against a local development store.

CI uses a fresh Postgres service, installs from the lockfile, generates environment secrets, runs unit and type checks, applies migrations, runs MCP integration tests, and builds the app. It does not make live payments or deploy a store.

[Documentation index](README.md) · [Contributing](../CONTRIBUTING.md)

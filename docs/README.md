# Inbirr Ecom documentation

Inbirr Ecom is a self-hosted starter for one store per installation. A store has a Next.js storefront, a Payload-backed admin, PostgreSQL, and optional MCP access for AI assistants. Creating a repository from the template does not create a database, deploy a website, or open payment accounts.

## Start here

- [Getting started](getting-started.md): install, start Postgres, create your first administrator, and publish your first product.
- [Configuration](configuration.md): environment variables, branding, storage, and currency.
- [Store management](store-management.md): catalog, variants, content, orders, and stock.
- [Connect an AI assistant](mcp.md): create a scoped key, connect a client, and use store tools.
- [Working with coding agents](agents.md): customize the application through repository access.

## Run and maintain a store

- [Deployment](deployment.md): staging, migrations, Vercel, and self-hosted Node.
- [Payments and email](payments.md): Stripe sandbox setup, verification, and current limitations.
- [Operations and launch](operations.md): launch checks, backups, recovery, and managed hosting.
- [Troubleshooting](troubleshooting.md): common startup, catalog, upload, checkout, and MCP issues.

## Develop the project

- [Architecture](architecture.md): routes, data ownership, and permission boundaries.
- [Development](development.md): source map, migrations, and tests.
- [Contributing](../CONTRIBUTING.md) and [security reporting](../SECURITY.md).

**Current scope:** a single-store starter. Stripe requires merchant credentials and sandbox validation. Chapa, ETB checkout, OAuth for MCP, automatic merchant provisioning, subscription billing, and production email delivery are not included.

[Back to the project](../README.md)

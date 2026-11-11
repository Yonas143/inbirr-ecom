# Inbirr Ecom Open Source

A self-hosted ecommerce starter with a Next.js storefront, shadcn/ui admin, PostgreSQL, and an authenticated MCP endpoint. Manage a store in the admin or connect an AI assistant to work with product drafts, media, inventory, prices, and order summaries.

[![GitHub checks](https://github.com/Yonas143/inbirr-ecom/actions/workflows/ci.yml/badge.svg)](https://github.com/Yonas143/inbirr-ecom/actions/workflows/ci.yml)

![Inbirr Ecom storefront](docs/preview.png)

## Quick start

Use Node **24.22.1+ (24.x)**, pnpm **10.12.1**, and Docker Compose or your own PostgreSQL 17 database.

```sh
git clone https://github.com/Yonas143/inbirr-ecom.git
cd inbirr-ecom
pnpm install --frozen-lockfile
pnpm run setup
docker compose up -d postgres
pnpm dev
```

Wait for Postgres to be healthy before starting the app. Visit `http://localhost:3000/admin` to create your first administrator; there is no shared password. The storefront is at `http://localhost:3000/`, and the catalog starts empty. [Walk through your first product](docs/getting-started.md).

## Documentation

- **[Documentation index](docs/README.md)** — choose a guide for your role.
- [Configure your store](docs/configuration.md) and [manage products, content, and orders](docs/store-management.md).
- [Connect your AI assistant](docs/mcp.md) and [customize with coding agents](docs/agents.md).
- [Deploy](docs/deployment.md), [configure Stripe and email](docs/payments.md), and [prepare for launch](docs/operations.md).
- [Architecture](docs/architecture.md), [development and tests](docs/development.md), and [troubleshooting](docs/troubleshooting.md).

## Connect an AI assistant

Sign in as an administrator and open `/account/ai`. Create an **AI Access Key**, choose its capabilities, and connect your MCP client to `/api/mcp` using a bearer header. Capabilities start disabled. A draft-only key can help prepare a catalog while you review and publish from the admin.

> “Create a draft for Studio Tote. Use my supplied photo and price it at USD 12.50. Show me the draft before publishing.”

Read the [MCP setup and tool examples](docs/mcp.md). OAuth is not included; use a client that supports Streamable HTTP with custom headers. Coding agents use a repository clone and [AGENTS.md](AGENTS.md) to change source code; store credentials grant store actions only.

## What ships today

The starter includes a storefront, cart, admin, migrations, configurable branding, and MCP tools for product drafts, images, simple-product USD prices and inventory, authorized publication, and read-only order summaries. It supports one store per installation.

**Stripe is scaffolded** and needs your credentials and sandbox tests. **Chapa and ETB checkout are unfinished.** Production email delivery, independent payment reconciliation, and a hosted merchant platform require additional work. See the [launch checklist](docs/operations.md#launch-checklist).

## License and contribution

MIT; see [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md). Inbirr Ecom is built on the Payload ecommerce template and retains the upstream notices and technical identifiers.

[Contribute](CONTRIBUTING.md) · [Report security issues privately](SECURITY.md) · [Mobile preview](docs/preview-mobile.png)

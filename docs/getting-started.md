# Getting started

This walkthrough takes you from a clean checkout to a published product in a local store. It does not need Stripe, email, or cloud credentials.

## 1. Prepare the tools

Use Node **24.22.1 or later in the 24.x series**, pnpm **10.12.1**, Git, and Docker with Compose. An existing PostgreSQL 17 database can replace Docker. Check the tools before installing:

```sh
node --version
pnpm --version
docker compose version
```

If pnpm is unavailable, install the pinned version using [pnpm's installation guide](https://pnpm.io/installation). Use Corepack only if it is available in your environment.

## 2. Install and configure

Use GitHub's **Use this template** to make your own repository, or clone this one for a local evaluation:

```sh
git clone https://github.com/Yonas143/inbirr-ecom.git
cd inbirr-ecom
pnpm install --frozen-lockfile
pnpm run setup
```

`pnpm run setup` writes `.env` from `.env.example` and generates two random secrets. It leaves an existing `.env` untouched. Use the full command: `pnpm setup` is a different command built into pnpm. The `.env` file is private and ignored by Git.

## 3. Start a local database and store

```sh
docker compose up -d postgres
docker compose ps
pnpm dev
```

Wait for the Postgres service to become healthy before starting the app. Compose listens on `127.0.0.1:5434` by default and keeps data in a named volume. If you supply your own database, create an empty database first, set `DATABASE_URL` in `.env`, and skip Compose.

The default local configuration uses schema push, which creates or updates tables when the app first connects. Use that mode only on a development database. To use committed migrations instead, see [development database workflows](development.md#database-workflows).

Open `http://localhost:3000`. If you use another port, update `NEXT_PUBLIC_SERVER_URL` and restart the server. For example, use `pnpm dev --port 3001` with `NEXT_PUBLIC_SERVER_URL=http://localhost:3001`.

## 4. Create the first administrator

Open `http://localhost:3000/admin` on your fresh database. Complete the first-user form with your own email and password. There is no default login. If a login page appears instead, an administrator already exists in the connected database; verify the target database before changing it.

Create the first admin while the store is private. Do not expose a fresh installation to the public with administrator setup unfinished.

## 5. Publish and preview a product

1. Open **Products → Create New** in the admin.
2. Enter a title and add a gallery image with meaningful alt text. Check the slug and category.
3. In **Product Details**, set inventory and enable the USD price if the item is available for purchase. Enter the price shown by the admin in dollars; MCP and API fields use integer cents.
4. Review the draft and publish it. Open `/shop` and the product detail page.
5. If the product has a price and stock, add it to the cart and verify the quantity and subtotal. Checkout stays unavailable until Stripe is configured.

For variants and content, see [store management](store-management.md). For your first AI-assisted draft, see [MCP connections](mcp.md).

To stop local Postgres without removing the saved data, run `docker compose stop postgres`. Keep database and media backups if you want to retain the store independently of your machine.

[Documentation index](README.md) · [Troubleshooting](troubleshooting.md)

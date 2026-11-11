# Troubleshooting

## The app cannot start

- **Unsupported Node or pnpm:** compare `node --version` and `pnpm --version` to `package.json`. Reinstall dependencies with the frozen lockfile after changing runtimes.
- **Missing secret:** run `pnpm run setup`. If `.env` already exists, populate its required secrets yourself; the script preserves it. `pnpm setup` invokes pnpm's own setup command.
- **Database refused or timed out:** check `docker compose ps`, the host and port in `DATABASE_URL`, and whether the app can reach that network. Local Compose uses port 5434. For a remote database, check the chosen pooler and TLS configuration; do not disable certificate verification to bypass an error.
- **Missing tables or columns:** confirm the target database, then apply the migrations from the same code revision. In production schema push is disabled.
- **Unexpected admin login instead of first-user setup:** the database already has a user. Check which environment you connected to before taking action.

## A product or image is missing

- Check that the product is published and its slug is correct. Drafts are intentionally hidden from public routes.
- Check price and stock on the selected variant or simple product. A valid product page does not guarantee that an item is purchasable.
- Verify the file exists in the storage configured for that environment. If uploads disappear after a serverless redeploy, configure durable storage and re-upload from your original files or restore media from backup.

## Checkout is unavailable

Check that the Stripe publishable key and secret come from the same environment. Restart locally or rebuild on the host after updating the public key. If the page shows Chapa unavailable, leave `PAYMENT_GEO_ROUTING=false` for a Stripe-only store. See [payments](payments.md).

If the provider shows a successful charge but the order is missing, reconcile the transaction before retrying. A webhook delivery response does not confirm order creation.

## The assistant cannot connect or act

- **404:** confirm `/api/mcp` is on the correct origin and `MCP_ENABLED=true` for that deployment.
- **401:** check the `Authorization: Bearer ...` header, key expiry, API key toggle, and the owner's admin role. Use a client that supports Streamable HTTP with headers.
- **Tools missing:** enable only the intended capabilities on that key, then reconnect the client. An authenticated connection may have no tools until you enable them.
- **Unexpected write result:** inspect the product and AI Activity before retrying. A failed response can occur after a write succeeds. Draft creation with an existing slug returns the existing product without applying new fields.

For help, share sanitized error messages, your commit, Node/pnpm versions, and reproducible steps. Keep environment values, keys, private preview URLs, and customer data out of issue reports.

[Documentation index](README.md)

# Operations and launch

## Launch checklist

- [ ] Complete first-admin setup privately. Verify that anonymous visitors cannot read private orders, customers, or AI activity.
- [ ] Replace starter copy and art. Enter real prices, inventory, media, contact information, delivery rules, and returns policy.
- [ ] Confirm domain, HTTPS, database connectivity, and durable media. Upload an image, redeploy staging, and verify the image still loads.
- [ ] Run [Stripe sandbox checkout](payments.md#test-stripe-in-a-sandbox), including failed payments, interrupted confirmation, duplicates, and refunds. Leave Chapa routing off unless the adapter and ETB checkout are implemented.
- [ ] Configure email and test delivery, password resets, and the order notifications you implement.
- [ ] Review AI key scopes and expiry. Test a read-only key and verify revocation. Keep MCP disabled when unused.
- [ ] Restore a database and media backup into an isolated store. Verify sign-in, catalog and images, order history, and stock.
- [ ] Set up monitoring for errors, availability, payment reconciliation, database connections, and storage usage. Assign someone to respond to failures.

## Backups and incidents

Back up PostgreSQL and the uploaded files. Record the application revision and schema version along with backups; keep recovery credentials separately. Use your provider's backup/export tools and protect customer data in storage and transit. A backup is useful only after a restore has been verified.

If checkout breaks, preserve the transaction references, check the payment provider, and reconcile before retrying or asking the customer to pay again. If a key leaks, disable or delete it in **AI Access Keys**, check recent **AI Activity**, and issue a replacement only as needed. Escalate suspected vulnerabilities via [private reporting](../SECURITY.md). AI Activity covers completed custom mutations, not every request or failure.

## Offer managed hosting

The repository supports separate stores, not a self-service merchant platform. A practical managed-hosting model is to provision one installation per merchant, give them their own domain and credentials, and charge separately for setup and recurring hosting/support. Keep each merchant's payment account, secrets, database, media, and backups isolated.

Document who owns the domain and data, what support covers, and how a merchant can export or leave. Before building a shared platform, design tenant isolation for the catalog, users, orders, storage, and MCP access. Merchant signup, automated provisioning, subscriptions, domain management, and multi-tenant administration are separate features to build and test.

[Documentation index](README.md)

# Payments and email

Stripe is scaffolded for one-off purchases in USD. A fresh installation has no payment credentials. Chapa, ETB pricing and checkout, and production email delivery require further implementation.

## Test Stripe in a sandbox

1. Create or select a Stripe sandbox and obtain its [API keys](https://docs.stripe.com/keys). Set matching `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` values in your private local `.env`.
2. Leave `PAYMENT_GEO_ROUTING=false` while testing Stripe. Restart the development app after environment changes.
3. For local webhook delivery, install the [Stripe CLI](https://docs.stripe.com/cli), authenticate to your sandbox, and run `pnpm stripe-webhooks`. The script forwards to `http://localhost:3000/api/payments/stripe/webhooks`. If your app uses another port, run `stripe listen --forward-to` with that origin and the same path.
4. Set `STRIPE_WEBHOOKS_SIGNING_SECRET` to the listener's signing secret and restart the app. Keep it private. For a deployed listener, use the signing secret for that specific endpoint and environment instead.
5. Publish a sandbox product with nonzero stock and a price. Add it to the cart, complete checkout using [Stripe test payment details](https://docs.stripe.com/testing), and return through order confirmation.
6. Confirm the expected amount and currency in Stripe, then check the matching transaction, order, and stock in the admin. Test a declined payment and a confirmation retry. Verify that a repeat confirmation does not create a second order or reduce stock twice.

## How order confirmation works

The checkout initiates a Stripe PaymentIntent and displays the Stripe form. The confirmation flow checks the provider's payment and matches it to the store transaction before finalizing the order. The webhook route is `/api/payments/stripe/webhooks`. The current configuration does not register custom webhook handlers to finalize orders independently of checkout confirmation.

A successful webhook HTTP response does **not** prove that an order exists. In staging, test an interrupted return from Stripe, then design and verify reconciliation for a successful charge whose order has not finalized. Include failed payments, pending payments, cancellations, stock conflicts, refunds, and duplicates in your launch testing. Refund reconciliation and automated order notifications are not supplied by this starter.

## Chapa and Ethiopia routing

The optional server-side rule reads Vercel's `x-vercel-ip-country` header. With `PAYMENT_GEO_ROUTING=true`, `ET` selects Chapa, while other or missing country codes select Stripe. IP location is an approximation, and a VPN or proxy can affect it. Chapa currently displays an unavailable message; enabling routing does not enable Chapa payments.

To implement Chapa, add an ETB pricing and checkout model, a provider adapter, signed webhook verification, server-side transaction reconciliation, and duplicate-event protection. Validate the provider result against the expected transaction reference, amount, currency, and mode before finalizing the order. Start with the [Chapa verification documentation](https://developer.chapa.co/integrations/verify-payments).

## Email

No production email adapter is configured. The development CMS can log email instead of delivering it. Configure an adapter and authenticated sending domain, then verify password resets in staging. Add and test order confirmation and fulfilment emails separately; setting an email transport alone does not add those workflows.

[Documentation index](README.md) · [Launch and operations](operations.md)

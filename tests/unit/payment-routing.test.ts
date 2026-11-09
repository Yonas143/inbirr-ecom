import assert from 'node:assert/strict'
import test from 'node:test'
import { paymentProviderForCountry } from '../../src/utilities/paymentRouting'

test('Ethiopian country codes select Chapa', () => {
  for (const country of ['ET', 'et', ' ET ']) {
    assert.equal(paymentProviderForCountry(country), 'chapa')
  }
})

test('other countries select Stripe', () => {
  for (const country of ['US', 'GB', 'KE', 'DE', 'AE']) {
    assert.equal(paymentProviderForCountry(country), 'stripe')
  }
})

test('missing or unknown country selects Stripe', () => {
  for (const country of [null, undefined, '', '  ', 'XX']) {
    assert.equal(paymentProviderForCountry(country), 'stripe')
  }
})

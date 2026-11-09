import type { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import React from 'react'
import { headers } from 'next/headers'
import { paymentProviderForCountry } from '@/utilities/paymentRouting'

import { CheckoutPage } from '@/components/checkout/CheckoutPage'

export default async function Checkout() {
  const requestHeaders = await headers()
  const paymentProvider = paymentProviderForCountry(process.env.PAYMENT_GEO_ROUTING === 'true' ? requestHeaders.get('x-vercel-ip-country') : null)
  return (
    <div className="container min-h-[90vh] flex">
      <h1 className="sr-only">Checkout</h1>

      <CheckoutPage paymentProvider={paymentProvider} />
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Checkout.',
  openGraph: mergeOpenGraph({
    title: 'Checkout',
    url: '/checkout',
  }),
  title: 'Checkout',
}

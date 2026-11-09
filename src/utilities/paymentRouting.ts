export type PaymentProvider = 'chapa' | 'stripe'

/** Use Vercel's server-provided country. Unknown countries use the international checkout. */
export function paymentProviderForCountry(country: string | null | undefined): PaymentProvider {
  return country?.trim().toUpperCase() === 'ET' ? 'chapa' : 'stripe'
}

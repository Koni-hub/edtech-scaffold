import Stripe from "stripe"

let stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set")
    stripe = new Stripe(key, { apiVersion: "2025-03-31" as any })
  }
  return stripe
}

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID ?? ""

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_PRO_PRICE_ID
}

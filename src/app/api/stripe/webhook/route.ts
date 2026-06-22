import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStripe, isStripeConfigured } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const stripe = getStripe()
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!endpointSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object
      const userId = session.metadata?.userId
      const subscriptionId = session.subscription as string
      const customerId = session.customer as string

      if (userId && subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        await supabase
          .from("profiles")
          .update({
            subscription_tier: "pro",
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            subscription_status: subscription.status,
          })
          .eq("id", userId)
      }
      break
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object
      const customerId = subscription.customer as string

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)

      if (profiles && profiles.length > 0) {
        const status = subscription.status
        const tier = status === "active" || status === "trialing" ? "pro" : "free"

        await supabase
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_status: status,
            stripe_subscription_id: event.type === "customer.subscription.deleted" ? null : subscription.id,
          })
          .eq("id", profiles[0].id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

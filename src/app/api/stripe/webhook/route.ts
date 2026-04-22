import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { env } from "@/lib/env";
import { renderEmailShell, sendEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPriceId, getStripe } from "@/lib/stripe";

function mapStripeStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "canceled":
    case "incomplete":
      return status;
    case "incomplete_expired":
    case "unpaid":
      return "expired";
    default:
      return "inactive";
  }
}

function resolvePlan(priceId?: string | null) {
  if (priceId === getPriceId("yearly")) return "yearly";
  return "monthly";
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const headerList = await headers();
  const signature = headerList.get("stripe-signature");

  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing Stripe webhook signature or secret." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      await admin.from("users").update({ stripe_customer_id: session.customer as string }).eq("id", userId);
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = resolvePlan(priceId);
    const status = mapStripeStatus(subscription.status);

    const { data: user } = await admin
      .from("users")
      .select("*")
      .eq("stripe_customer_id", customerId)
      .single();

    if (user) {
      const amountCents = subscription.items.data[0]?.price.unit_amount ?? 0;
      const charityAmountCents = Math.round(amountCents * ((user.charity_percentage ?? 10) / 100));
      const prizePoolAmountCents = amountCents - charityAmountCents;

      const { data: subscriptionRow } = await admin
        .from("subscriptions")
        .upsert(
          {
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            stripe_price_id: priceId,
            plan,
            status,
            amount_cents: amountCents,
            currency: subscription.currency,
            current_period_start: new Date(subscription.items.data[0].current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
          },
          { onConflict: "stripe_subscription_id" },
        )
        .select("*")
        .single();

      await admin
        .from("users")
        .update({ role: status === "active" || status === "trialing" ? "subscriber" : "public" })
        .eq("id", user.id);

      if (event.type !== "customer.subscription.deleted" && subscriptionRow && user.charity_id) {
        await admin.from("contributions").insert({
          user_id: user.id,
          charity_id: user.charity_id,
          subscription_id: subscriptionRow.id,
          gross_amount_cents: amountCents,
          charity_percentage: user.charity_percentage,
          charity_amount_cents: charityAmountCents,
          prize_pool_amount_cents: prizePoolAmountCents,
        });
      }

      await sendEmail({
        to: user.email,
        subject: "Your DriveChange subscription has been updated",
        html: renderEmailShell(
          "Subscription update",
          `<p>Hi ${user.full_name},</p><p>Your subscription is now marked as <strong>${status}</strong>.</p>`,
        ),
      });
    }
  }

  return NextResponse.json({ received: true });
}

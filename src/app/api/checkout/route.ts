import { NextResponse } from "next/server";
import { z } from "zod";

import { env, isMockMode } from "@/lib/env";
import { requireUser, getProfile } from "@/lib/auth/session";
import { getPlanById, getPriceId, getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  plan: z.enum(["monthly", "yearly"]),
});

export async function POST(request: Request) {
  try {
    if (isMockMode) {
      const { plan } = schema.parse(await request.json());
      return NextResponse.json({ url: `/dashboard/subscription?mockCheckout=1&plan=${plan}` });
    }

    const user = await requireUser();
    const profile = await getProfile(user.id);
    const { plan } = schema.parse(await request.json());
    const priceId = getPriceId(plan);
    const planDetails = getPlanById(plan);

    if (!priceId || !planDetails) {
      return NextResponse.json({ error: "Stripe price ID is not configured." }, { status: 500 });
    }

    const stripe = getStripe();
    const admin = createAdminClient();

    let customerId = profile.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name,
        metadata: {
          userId: profile.id,
        },
      });
      customerId = customer.id;
      await admin.from("users").update({ stripe_customer_id: customer.id }).eq("id", profile.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=1`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=1`,
      metadata: {
        userId: profile.id,
        charityId: profile.charity_id ?? "",
        charityPercentage: String(profile.charity_percentage),
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session." },
      { status: 400 },
    );
  }
}

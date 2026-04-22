import { NextResponse } from "next/server";

import { env, isMockMode } from "@/lib/env";
import { getProfile, requireUser } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    if (isMockMode) {
      return NextResponse.json({ url: "/dashboard/subscription?mockPortal=1" });
    }

    const user = await requireUser();
    const profile = await getProfile(user.id);

    if (!profile.stripe_customer_id) {
      return NextResponse.json({ error: "No Stripe customer found for this user." }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create billing portal session." },
      { status: 400 },
    );
  }
}

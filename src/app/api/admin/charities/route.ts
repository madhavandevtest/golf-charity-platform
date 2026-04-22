import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { charitySchema } from "@/lib/validators/charity";

export async function POST(request: Request) {
  try {
    if (isMockMode) {
      const payload = charitySchema.parse(await request.json());
      return NextResponse.json({
        data: {
          id: crypto.randomUUID(),
          name: payload.name,
          slug: payload.slug,
          category: payload.category,
          location: payload.location,
          website_url: payload.websiteUrl || null,
          summary: payload.summary,
          description: payload.description,
          impact_stat: payload.impactStat,
          featured: payload.featured,
          active: payload.active,
        },
      });
    }

    await requireAdmin();
    const payload = charitySchema.parse(await request.json());
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("charities")
      .insert({
        name: payload.name,
        slug: payload.slug,
        category: payload.category,
        location: payload.location,
        website_url: payload.websiteUrl || null,
        summary: payload.summary,
        description: payload.description,
        impact_stat: payload.impactStat,
        featured: payload.featured,
        active: payload.active,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create charity." },
      { status: 400 },
    );
  }
}

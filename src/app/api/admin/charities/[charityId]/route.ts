import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { charitySchema } from "@/lib/validators/charity";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ charityId: string }> },
) {
  try {
    if (isMockMode) {
      const payload = charitySchema.parse(await request.json());
      const { charityId } = await params;
      return NextResponse.json({
        data: {
          id: charityId,
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
    const { charityId } = await params;
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("charities")
      .update({
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
      .eq("id", charityId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update charity." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ charityId: string }> },
) {
  try {
    if (isMockMode) {
      return NextResponse.json({ success: true });
    }

    await requireAdmin();
    const { charityId } = await params;
    const admin = createAdminClient();
    const { error } = await admin.from("charities").delete().eq("id", charityId);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete charity." },
      { status: 400 },
    );
  }
}

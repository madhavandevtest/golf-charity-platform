import { NextResponse } from "next/server";
import { z } from "zod";

import { getProfile, requireAdmin } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  verificationStatus: z.enum(["pending", "approved", "rejected"]),
  paymentStatus: z.enum(["pending", "paid"]).optional(),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ winnerId: string }> },
) {
  try {
    if (isMockMode) {
      const payload = schema.parse(await request.json());
      const { winnerId } = await params;
      return NextResponse.json({
        data: {
          id: winnerId,
          verification_status: payload.verificationStatus,
          payment_status: payload.paymentStatus ?? "pending",
          admin_notes: payload.adminNotes ?? null,
        },
      });
    }

    const adminUser = await requireAdmin();
    await getProfile(adminUser.id);
    const payload = schema.parse(await request.json());
    const { winnerId } = await params;
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("winners")
      .update({
        verification_status: payload.verificationStatus,
        payment_status: payload.paymentStatus ?? "pending",
        admin_notes: payload.adminNotes ?? null,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", winnerId)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update winner." },
      { status: 400 },
    );
  }
}

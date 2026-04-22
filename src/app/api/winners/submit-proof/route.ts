import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  winnerId: z.string().uuid(),
  filePath: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    if (isMockMode) {
      const payload = schema.parse(await request.json());
      return NextResponse.json({
        data: {
          id: payload.winnerId,
          proof_url: payload.filePath,
          verification_status: "pending",
        },
      });
    }

    const user = await requireUser();
    const payload = schema.parse(await request.json());
    const admin = createAdminClient();

    const { data, error } = await admin
      .from("winners")
      .update({
        proof_url: payload.filePath,
        verification_status: "pending",
      })
      .eq("id", payload.winnerId)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit proof." },
      { status: 400 },
    );
  }
}

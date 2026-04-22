import { NextResponse } from "next/server";
import { z } from "zod";

import { requireUser } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  charityPercentage: z.number().min(10).max(100),
});

export async function PATCH(request: Request) {
  try {
    if (isMockMode) {
      return NextResponse.json({ success: true });
    }
    const user = await requireUser();
    const { charityPercentage } = schema.parse(await request.json());
    const supabase = await createClient();
    const { error } = await supabase
      .from("users")
      .update({ charity_percentage: charityPercentage })
      .eq("id", user.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update charity percentage." },
      { status: 400 },
    );
  }
}

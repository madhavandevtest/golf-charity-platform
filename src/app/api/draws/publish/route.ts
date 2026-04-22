import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { publishDraw } from "@/lib/draw-engine";
import { publishDrawSchema } from "@/lib/validators/draw";

export async function POST(request: Request) {
  try {
    if (isMockMode) {
      const payload = publishDrawSchema.parse(await request.json());
      return NextResponse.json({
        draw: {
          id: payload.drawId,
          status: "published",
          published_at: new Date().toISOString(),
        },
      });
    }

    await requireAdmin();
    const payload = publishDrawSchema.parse(await request.json());
    const draw = await publishDraw(payload.drawId);
    return NextResponse.json({ draw });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to publish draw." },
      { status: 400 },
    );
  }
}

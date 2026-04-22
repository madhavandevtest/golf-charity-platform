import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { simulateDraw } from "@/lib/draw-engine";
import { drawSimulationSchema } from "@/lib/validators/draw";

export async function POST(request: Request) {
  try {
    if (isMockMode) {
      const payload = drawSimulationSchema.parse(await request.json());
      return NextResponse.json({
        drawId: crypto.randomUUID(),
        winningNumbers: [12, 28, 32, 36, 40],
        prizePoolCents: 186000,
        resultCount: 128,
        drawMonth: payload.drawMonth,
      });
    }

    await requireAdmin();
    const payload = drawSimulationSchema.parse(await request.json());
    const result = await simulateDraw(payload);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to simulate draw." },
      { status: 400 },
    );
  }
}

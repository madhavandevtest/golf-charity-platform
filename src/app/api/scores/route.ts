import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/session";
import { isMockMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { scoreSchema, updateScoreSchema } from "@/lib/validators/score";

export async function POST(request: Request) {
  try {
    if (isMockMode) {
      const payload = scoreSchema.parse(await request.json());
      return NextResponse.json({
        data: {
          id: crypto.randomUUID(),
          played_on: payload.playedOn,
          stableford_points: payload.stablefordPoints,
          course_name: payload.courseName || null,
        },
      });
    }

    await requireUser();
    const payload = scoreSchema.parse(await request.json());
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("add_score", {
      p_played_on: payload.playedOn,
      p_stableford_points: payload.stablefordPoints,
      p_course_name: payload.courseName || null,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save score." },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (isMockMode) {
      const payload = updateScoreSchema.parse(await request.json());
      return NextResponse.json({
        data: {
          id: payload.id,
          played_on: payload.playedOn,
          stableford_points: payload.stablefordPoints,
          course_name: payload.courseName || null,
        },
      });
    }

    const user = await requireUser();
    const payload = updateScoreSchema.parse(await request.json());
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("scores")
      .update({
        played_on: payload.playedOn,
        stableford_points: payload.stablefordPoints,
        course_name: payload.courseName || null,
      })
      .eq("id", payload.id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update score." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (isMockMode) {
      return NextResponse.json({ success: true });
    }
    const user = await requireUser();
    const { id } = await request.json();
    if (!id) throw new Error("Score ID required");
    const supabase = await createClient();
    const { error } = await supabase
      .from("scores")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete score." },
      { status: 400 },
    );
  }
}

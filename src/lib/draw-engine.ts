import { addMonths, format } from "date-fns";

import { sendEmail, renderEmailShell } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AppUser, Score } from "@/lib/types";

function buildWinningNumbers(mode: "random" | "algorithm", seed: string) {
  if (mode === "algorithm") {
    return seed
      .replaceAll("-", "")
      .slice(0, 10)
      .split("")
      .map((value, index) => ((Number(value) + index * 7) % 45) + 1)
      .slice(0, 5);
  }

  const selected = new Set<number>();
  while (selected.size < 5) {
    selected.add(Math.floor(Math.random() * 45) + 1);
  }
  return [...selected].sort((a, b) => a - b);
}

function getMonthlyEquivalent(amountCents: number, plan: "monthly" | "yearly") {
  return plan === "yearly" ? Math.round(amountCents / 12) : amountCents;
}

export async function simulateDraw({
  drawMonth,
  mode,
}: {
  drawMonth: string;
  mode: "random" | "algorithm";
}) {
  const supabase = createAdminClient();

  const [{ data: subscriptions }, { data: userRows }, { data: existingDraw }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id, user_id, plan, amount_cents, status")
      .in("status", ["active", "trialing"]),
    supabase.from("users").select("*"),
    supabase.from("draws").select("*").eq("draw_month", drawMonth).maybeSingle(),
  ]);

  const users = (userRows ?? []) as AppUser[];
  const winningNumbers = buildWinningNumbers(mode, drawMonth);
  const activeSubscriptions = subscriptions ?? [];

  const totalMonthlyRevenue = activeSubscriptions.reduce(
    (sum, subscription) =>
      sum + getMonthlyEquivalent(subscription.amount_cents as number, subscription.plan as "monthly" | "yearly"),
    0,
  );

  const totalCharityCents = activeSubscriptions.reduce((sum, subscription) => {
    const user = users.find((item) => item.id === subscription.user_id);
    const percent = user?.charity_percentage ?? 10;
    return sum + Math.round(getMonthlyEquivalent(subscription.amount_cents as number, subscription.plan as "monthly" | "yearly") * (percent / 100));
  }, 0);

  const prizePoolCents = Math.max(totalMonthlyRevenue - totalCharityCents, 0) + (existingDraw?.rollover_cents ?? 0);

  const drawPayload = {
    title: `DriveChange ${format(new Date(drawMonth), "MMMM yyyy")} Draw`,
    draw_month: drawMonth,
    status: "simulated",
    winning_numbers: winningNumbers,
    prize_pool_cents: prizePoolCents,
    simulated_at: new Date().toISOString(),
  };

  const { data: draw, error: drawError } = existingDraw
    ? await supabase.from("draws").update(drawPayload).eq("id", existingDraw.id).select("*").single()
    : await supabase.from("draws").insert(drawPayload).select("*").single();

  if (drawError || !draw) {
    throw new Error(drawError?.message ?? "Unable to create draw.");
  }

  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .in(
      "user_id",
      activeSubscriptions.map((subscription) => subscription.user_id),
    )
    .order("played_on", { ascending: false });

  const byUser = new Map<string, Score[]>();
  ((scores ?? []) as Score[]).forEach((score) => {
    const rows = byUser.get(score.user_id) ?? [];
    if (rows.length < 5) {
      rows.push(score);
      byUser.set(score.user_id, rows);
    }
  });

  await supabase.from("draw_results").delete().eq("draw_id", draw.id);

  const results = activeSubscriptions.map((subscription) => {
    const latestScores = (byUser.get(subscription.user_id as string) ?? [])
      .map((score) => score.stableford_points)
      .slice(0, 5);
    const matchedNumbers = latestScores.filter((score) => winningNumbers.includes(score));
    return {
      draw_id: draw.id,
      user_id: subscription.user_id,
      entry_numbers: latestScores,
      matched_numbers: matchedNumbers,
      match_count: matchedNumbers.length,
      prize_amount_cents: 0,
      is_winner: matchedNumbers.length >= 3,
    };
  });

  const winners3 = results.filter((item) => item.match_count === 3);
  const winners4 = results.filter((item) => item.match_count === 4);
  const winners5 = results.filter((item) => item.match_count === 5);

  const fiveMatchPool = Math.round(prizePoolCents * 0.4);
  const fourMatchPool = Math.round(prizePoolCents * 0.35);
  const threeMatchPool = prizePoolCents - fiveMatchPool - fourMatchPool;

  results.forEach((result) => {
    if (result.match_count === 5 && winners5.length > 0) {
      result.prize_amount_cents = Math.floor(fiveMatchPool / winners5.length);
    }
    if (result.match_count === 4 && winners4.length > 0) {
      result.prize_amount_cents = Math.floor(fourMatchPool / winners4.length);
    }
    if (result.match_count === 3 && winners3.length > 0) {
      result.prize_amount_cents = Math.floor(threeMatchPool / winners3.length);
    }
  });

  if (results.length > 0) {
    await supabase.from("draw_results").insert(results);
  }

  const rolloverCents = winners5.length === 0 ? fiveMatchPool : 0;
  await supabase.from("draws").update({ rollover_cents: rolloverCents }).eq("id", draw.id);

  return {
    drawId: draw.id,
    winningNumbers,
    prizePoolCents,
    resultCount: results.length,
  };
}

export async function publishDraw(drawId: string) {
  const supabase = createAdminClient();
  const { data: draw, error } = await supabase
    .from("draws")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", drawId)
    .select("*")
    .single();

  if (error || !draw) {
    throw new Error(error?.message ?? "Unable to publish draw.");
  }

  const { data: results } = await supabase
    .from("draw_results")
    .select("*, users(email, full_name)")
    .eq("draw_id", drawId);

  const winnerRows = (results ?? []).filter((item) => item.prize_amount_cents > 0);
  if (winnerRows.length > 0) {
    await supabase.from("winners").upsert(
      winnerRows.map((row) => ({
        draw_result_id: row.id,
        user_id: row.user_id,
        verification_status: "not_submitted",
        payment_status: "pending",
      })),
      { onConflict: "draw_result_id" },
    );
  }

  await Promise.all(
    (results ?? []).map((result) =>
      sendEmail({
        to: result.users.email,
        subject: `DriveChange draw result for ${draw.title}`,
        html: renderEmailShell(
          "Monthly draw update",
          `<p>Hi ${result.users.full_name},</p><p>Your latest draw result has been published. You matched ${result.match_count} number(s) and your current prize status is ${result.prize_amount_cents > 0 ? "winner" : "not a prize result"}.</p>`,
        ),
      }),
    ),
  );

  return draw;
}

export async function sendWinnerAlert(email: string, fullName: string, amountCents: number) {
  await sendEmail({
    to: email,
    subject: "You have a pending DriveChange prize",
    html: renderEmailShell(
      "You are in the winner queue",
      `<p>Hi ${fullName},</p><p>You have a pending prize of ${amountCents / 100} USD. Please upload proof in your dashboard so the admin team can verify and pay out your winnings.</p>`,
    ),
  });
}

export function getUpcomingDrawMonth() {
  return format(addMonths(new Date(), 1), "yyyy-MM-01");
}

import { subMonths } from "date-fns";

import { isMockMode } from "@/lib/env";
import {
  mockAdminUser,
  mockCharities,
  mockContributions,
  mockDraws,
  mockResults,
  mockScores,
  mockSubscription,
  mockUser,
  mockWinners,
} from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { Charity, Draw, DrawResult, Score, Subscription, Winner } from "@/lib/types";

export async function getCharities(search?: string) {
  if (isMockMode) {
    const term = search?.toLowerCase();
    return mockCharities.filter((charity) =>
      !term
        ? true
        : [charity.name, charity.category, charity.location].some((value) =>
            value.toLowerCase().includes(term),
          ),
    );
  }

  const supabase = await createClient();
  let query = supabase
    .from("charities")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (search) {
    query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%,location.ilike.%${search}%`);
  }

  const { data, error } = await query.returns<Charity[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getFeaturedCharity() {
  if (isMockMode) {
    return mockCharities.find((charity) => charity.featured) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("charities")
    .select("*")
    .eq("featured", true)
    .eq("active", true)
    .single<Charity>();

  return data;
}

export async function getCharityBySlug(slug: string) {
  if (isMockMode) {
    const charity = mockCharities.find((item) => item.slug === slug);
    if (!charity) {
      throw new Error("Charity not found");
    }
    return charity;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("charities")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single<Charity>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUserDashboardData(userId: string) {
  if (isMockMode) {
    const latestPublishedDraw = mockDraws[0] ?? null;
    const upcomingDraw = latestPublishedDraw
      ? {
          ...latestPublishedDraw,
          id: "30000000-0000-0000-0000-000000000099",
          title: "DriveChange May 2026 Draw",
          draw_month: "2026-05-01",
          status: "draft" as const,
          published_at: null,
        }
      : null;

    return {
      profile: {
        ...mockUser,
        charities: mockCharities.find((charity) => charity.id === mockUser.charity_id) ?? null,
      },
      subscription: mockSubscription,
      scores: mockScores,
      results: mockResults.map((result) => ({
        ...result,
        draws: mockDraws.find((draw) => draw.id === result.draw_id) ?? null,
      })),
      winners: mockWinners.map((winner) => ({
        ...winner,
        draw_results: {
          ...mockResults.find((result) => result.id === winner.draw_result_id)!,
          draws: mockDraws.find(
            (draw) => draw.id === mockResults.find((result) => result.id === winner.draw_result_id)?.draw_id,
          ) ?? null,
        },
      })),
      upcomingDraw,
      subscriberCount: 128,
    };
  }

  const supabase = await createClient();
  const currentMonthStart = new Date();
  currentMonthStart.setUTCDate(1);
  currentMonthStart.setUTCHours(0, 0, 0, 0);

  const [
    { data: profile },
    { data: subscription },
    { data: scores },
    { data: results },
    { data: winnerRows },
    { data: upcomingDraw },
    { count: subscriberCount },
  ] = await Promise.all([
      supabase.from("users").select("*, charities(*)").eq("id", userId).single(),
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<Subscription>(),
      supabase
        .from("scores")
        .select("*")
        .eq("user_id", userId)
        .order("played_on", { ascending: false })
        .returns<Score[]>(),
      supabase
        .from("draw_results")
        .select("*, draws(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .returns<DrawResult[]>(),
      supabase
        .from("winners")
        .select("*, draw_results(*, draws(*))")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .returns<Winner[]>(),
      supabase
        .from("draws")
        .select("*")
        .gte("draw_month", currentMonthStart.toISOString().slice(0, 10))
        .order("draw_month", { ascending: true })
        .limit(1)
        .maybeSingle<Draw>(),
      supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .in("status", ["active", "trialing"]),
    ]);

  return {
    profile,
    subscription,
    scores: scores ?? [],
    results: results ?? [],
    winners: winnerRows ?? [],
    upcomingDraw,
    subscriberCount: subscriberCount ?? 0,
  };
}

export async function getAdminDashboardData() {
  if (isMockMode) {
    return {
      userCount: 128,
      subscriptions: [
        {
          ...mockSubscription,
          users: {
            email: mockUser.email,
            full_name: mockUser.full_name,
          },
        },
      ] as Subscription[],
      contributions: mockContributions,
      draws: mockDraws,
      winners: mockWinners,
      charities: mockCharities,
      users: [mockUser, mockAdminUser],
    };
  }

  const supabase = await createClient();
  const since = subMonths(new Date(), 6).toISOString();

  const [
    { count: userCount },
    { data: subscriptions },
    { data: contributions },
    { data: draws },
    { data: winners },
    { data: charities },
    { data: users },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("subscriptions")
      .select("*, users(email, full_name)")
      .gte("created_at", since)
      .returns<Subscription[]>(),
    supabase.from("contributions").select("*"),
    supabase.from("draws").select("*").order("draw_month", { ascending: false }).returns<Draw[]>(),
    supabase.from("winners").select("*, users(full_name, email), draw_results(*, draws(*))").returns<Winner[]>(),
    supabase.from("charities").select("*").returns<Charity[]>(),
    supabase.from("users").select("*"),
  ]);

  return {
    userCount: userCount ?? 0,
    subscriptions: subscriptions ?? [],
    contributions: contributions ?? [],
    draws: draws ?? [],
    winners: winners ?? [],
    charities: charities ?? [],
    users: users ?? [],
  };
}

export async function getPublicStats() {
  if (isMockMode) {
    return {
      subscribers: 128,
      totalDonations: mockContributions.reduce((sum, item) => sum + item.charity_amount_cents, 0),
      totalPrizePool: mockDraws.reduce((sum, draw) => sum + draw.prize_pool_cents, 0),
      drawCount: mockDraws.length,
    };
  }

  const supabase = await createClient();
  const [{ count: subscribers }, { data: contributions }, { data: draws }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .in("status", ["active", "trialing"]),
    supabase.from("contributions").select("*"),
    supabase.from("draws").select("*").eq("status", "published").returns<Draw[]>(),
  ]);

  const totalDonations =
    contributions?.reduce((sum, item) => sum + (item.charity_amount_cents as number), 0) ?? 0;
  const totalPrizePool =
    draws?.reduce((sum, draw) => sum + (draw.prize_pool_cents as number), 0) ?? 0;

  return {
    subscribers: subscribers ?? 0,
    totalDonations,
    totalPrizePool,
    drawCount: draws?.length ?? 0,
  };
}

export async function getLatestPublishedDraw() {
  if (isMockMode) {
    return mockDraws[0] ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("draws")
    .select("*")
    .eq("status", "published")
    .order("draw_month", { ascending: false })
    .limit(1)
    .maybeSingle<Draw>();

  return data;
}

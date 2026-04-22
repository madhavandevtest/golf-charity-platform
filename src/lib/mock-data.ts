import type { AppUser, Charity, Draw, DrawResult, Score, Subscription, Winner } from "@/lib/types";

export const mockUser: AppUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "subscriber@drivechange.local",
  full_name: "Alex Fairway",
  role: "subscriber",
  charity_id: "10000000-0000-0000-0000-000000000001",
  charity_percentage: 15,
  stripe_customer_id: "cus_mock_123",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockAdminUser: AppUser = {
  ...mockUser,
  id: "00000000-0000-0000-0000-000000000002",
  email: "venisha16301@mail.com",
  full_name: "Venisha Admin",
  role: "admin",
};

// Never commit real passwords — set MOCK_ADMIN_PASSWORD in .env.local
export const MOCK_ADMIN_PASSWORD = "CHANGE_ME_IN_ENV";

export const mockCharities: Charity[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    slug: "youth-links",
    name: "Youth Links Collective",
    category: "Youth Development",
    location: "Manchester, UK",
    website_url: "https://example.org/youth-links",
    logo_url: null,
    summary: "Funds coaching, mentoring, and accessible recreation for underrepresented young people.",
    description:
      "Youth Links Collective creates access to confidence-building programs, school support, and community-led wellbeing services for young people who need a safe launchpad.",
    impact_stat: "2,800 young people supported in the last 12 months",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    slug: "clean-water-foundation",
    name: "Clean Water Foundation",
    category: "Water Security",
    location: "Austin, USA",
    website_url: "https://example.org/clean-water",
    logo_url: null,
    summary: "Builds community water systems and resilience projects for families facing unreliable supply.",
    description:
      "Clean Water Foundation partners with local communities to install filtration, education, and rapid-response water infrastructure where health outcomes are at risk.",
    impact_stat: "48 villages now have reliable drinking water access",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    slug: "green-horizons",
    name: "Green Horizons Alliance",
    category: "Climate Action",
    location: "Cape Town, South Africa",
    website_url: "https://example.org/green-horizons",
    logo_url: null,
    summary: "Restores native habitats while creating paid green jobs in vulnerable regions.",
    description:
      "Green Horizons Alliance supports reforestation, biodiversity corridors, and local employment pathways that leave communities more resilient over time.",
    impact_stat: "120,000 trees planted with local job placement support",
    featured: false,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockSubscription: Subscription = {
  id: "20000000-0000-0000-0000-000000000001",
  user_id: mockUser.id,
  stripe_subscription_id: "sub_mock_123",
  stripe_customer_id: "cus_mock_123",
  stripe_price_id: "price_mock_monthly",
  plan: "monthly",
  status: "active",
  amount_cents: 2900,
  currency: "usd",
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  cancel_at_period_end: false,
  canceled_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockScores: Score[] = [
  { id: "s1", user_id: mockUser.id, played_on: "2026-04-21", stableford_points: 36, course_name: "Royal Dunes", created_at: "", updated_at: "" },
  { id: "s2", user_id: mockUser.id, played_on: "2026-04-14", stableford_points: 32, course_name: "North Reach", created_at: "", updated_at: "" },
  { id: "s3", user_id: mockUser.id, played_on: "2026-04-07", stableford_points: 28, course_name: "Westmere", created_at: "", updated_at: "" },
  { id: "s4", user_id: mockUser.id, played_on: "2026-03-31", stableford_points: 40, course_name: "Royal Dunes", created_at: "", updated_at: "" },
  { id: "s5", user_id: mockUser.id, played_on: "2026-03-24", stableford_points: 33, course_name: "Seabrook", created_at: "", updated_at: "" },
];

export const mockDraws: Draw[] = [
  {
    id: "30000000-0000-0000-0000-000000000001",
    title: "DriveChange April 2026 Draw",
    draw_month: "2026-04-01",
    status: "published",
    winning_numbers: [12, 28, 32, 36, 40],
    prize_pool_cents: 186000,
    rollover_cents: 0,
    notes: "Mock published draw",
    simulated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockResults: DrawResult[] = [
  {
    id: "40000000-0000-0000-0000-000000000001",
    draw_id: mockDraws[0].id,
    user_id: mockUser.id,
    entry_numbers: [36, 32, 28, 40, 33],
    matched_numbers: [36, 32, 28, 40],
    match_count: 4,
    prize_amount_cents: 65100,
    is_winner: true,
    created_at: new Date().toISOString(),
  },
];

export const mockWinners: Winner[] = [
  {
    id: "50000000-0000-0000-0000-000000000001",
    draw_result_id: mockResults[0].id,
    user_id: mockUser.id,
    verification_status: "pending",
    payment_status: "pending",
    proof_url: null,
    admin_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockContributions = [
  {
    id: "c1",
    user_id: mockUser.id,
    charity_id: mockCharities[0].id,
    gross_amount_cents: 2900,
    charity_percentage: 15,
    charity_amount_cents: 435,
    prize_pool_amount_cents: 2465,
    created_at: new Date().toISOString(),
  },
];

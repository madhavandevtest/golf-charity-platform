export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "public" | "subscriber" | "admin";
export type SubscriptionPlan = "monthly" | "yearly";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired"
  | "incomplete"
  | "inactive";
export type DrawStatus = "draft" | "simulated" | "published";
export type VerificationStatus = "not_submitted" | "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "paid";

export interface Charity {
  id: string;
  slug: string;
  name: string;
  category: string;
  location: string;
  website_url: string | null;
  logo_url: string | null;
  summary: string;
  description: string;
  impact_stat: string;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  charity_id: string | null;
  charity_percentage: number;
  stripe_customer_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  charities?: Charity | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  stripe_price_id: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount_cents: number;
  currency: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
  users?: Pick<AppUser, "email" | "full_name"> | null;
}

export interface Score {
  id: string;
  user_id: string;
  played_on: string;
  stableford_points: number;
  course_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Draw {
  id: string;
  title: string;
  draw_month: string;
  status: DrawStatus;
  winning_numbers: number[];
  prize_pool_cents: number;
  rollover_cents: number;
  notes: string | null;
  simulated_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DrawResult {
  id: string;
  draw_id: string;
  user_id: string;
  entry_numbers: number[];
  matched_numbers: number[];
  match_count: number;
  prize_amount_cents: number;
  is_winner: boolean;
  created_at: string;
  draws?: Draw | null;
}

export interface Winner {
  id: string;
  draw_result_id: string;
  user_id: string;
  verification_status: VerificationStatus;
  payment_status: PaymentStatus;
  proof_url: string | null;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  draw_results?: (DrawResult & { draws?: Draw | null }) | null;
}

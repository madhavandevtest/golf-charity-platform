-- SOURCE OF TRUTH: This schema matches the app codebase exactly.
create extension if not exists "pgcrypto";

create type public.user_role as enum ('public', 'subscriber', 'admin');
create type public.subscription_plan as enum ('monthly', 'yearly');
create type public.subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'expired',
  'incomplete',
  'inactive'
);
create type public.draw_status as enum ('draft', 'simulated', 'published');
create type public.verification_status as enum ('not_submitted', 'pending', 'approved', 'rejected');
create type public.payment_status as enum ('pending', 'paid');

create table public.charities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  location text not null,
  website_url text,
  logo_url text,
  summary text not null,
  description text not null,
  impact_stat text not null,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.user_role not null default 'public',
  charity_id uuid references public.charities(id) on delete set null,
  charity_percentage numeric(5,2) not null default 10 check (charity_percentage >= 10 and charity_percentage <= 100),
  stripe_customer_id text unique,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  stripe_price_id text,
  plan public.subscription_plan not null,
  status public.subscription_status not null default 'inactive',
  amount_cents integer not null default 0,
  currency text not null default 'usd',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  played_on date not null,
  stableford_points integer not null check (stableford_points between 1 and 45),
  course_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, played_on)
);

create table public.draws (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  draw_month date not null unique,
  status public.draw_status not null default 'draft',
  winning_numbers integer[] not null default '{}',
  prize_pool_cents integer not null default 0,
  rollover_cents integer not null default 0,
  notes text,
  simulated_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (array_length(winning_numbers, 1) is null or array_length(winning_numbers, 1) = 5)
);

create table public.draw_results (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  entry_numbers integer[] not null default '{}',
  matched_numbers integer[] not null default '{}',
  match_count integer not null default 0 check (match_count between 0 and 5),
  prize_amount_cents integer not null default 0,
  is_winner boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (draw_id, user_id)
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  charity_id uuid not null references public.charities(id) on delete restrict,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  draw_id uuid references public.draws(id) on delete set null,
  gross_amount_cents integer not null,
  charity_percentage numeric(5,2) not null,
  charity_amount_cents integer not null,
  prize_pool_amount_cents integer not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.winners (
  id uuid primary key default gen_random_uuid(),
  draw_result_id uuid not null unique references public.draw_results(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  verification_status public.verification_status not null default 'not_submitted',
  payment_status public.payment_status not null default 'pending',
  proof_url text,
  admin_notes text,
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger charities_set_updated_at before update on public.charities for each row execute function public.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger scores_set_updated_at before update on public.scores for each row execute function public.set_updated_at();
create trigger draws_set_updated_at before update on public.draws for each row execute function public.set_updated_at();
create trigger winners_set_updated_at before update on public.winners for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do nothing;

  update public.users
  set
    charity_id = nullif(new.raw_user_meta_data ->> 'charity_id', '')::uuid,
    charity_percentage = coalesce(nullif(new.raw_user_meta_data ->> 'charity_percentage', '')::numeric, 10)
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.add_score(
  p_played_on date,
  p_stableford_points integer,
  p_course_name text default null
)
returns public.scores
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_score public.scores;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_stableford_points < 1 or p_stableford_points > 45 then
    raise exception 'Stableford points must be between 1 and 45';
  end if;

  if exists (
    select 1 from public.scores
    where user_id = auth.uid() and played_on = p_played_on
  ) then
    raise exception 'A score already exists for that date';
  end if;

  insert into public.scores (user_id, played_on, stableford_points, course_name)
  values (auth.uid(), p_played_on, p_stableford_points, p_course_name)
  returning * into inserted_score;

  delete from public.scores
  where id in (
    select id from public.scores
    where user_id = auth.uid()
    order by played_on desc, created_at desc
    offset 5
  );

  return inserted_score;
end;
$$;

alter table public.charities enable row level security;
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.scores enable row level security;
alter table public.draws enable row level security;
alter table public.draw_results enable row level security;
alter table public.contributions enable row level security;
alter table public.winners enable row level security;

create policy "Public can read active charities"
on public.charities for select
using (active = true or public.is_admin());

create policy "Admins manage charities"
on public.charities for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users read own profile"
on public.users for select
using (auth.uid() = id or public.is_admin());

create policy "Users update own profile"
on public.users for update
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "Admins insert users"
on public.users for insert
with check (public.is_admin());

create policy "Users read own subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id or public.is_admin());

create policy "Admins manage subscriptions"
on public.subscriptions for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users read own scores"
on public.scores for select
using (auth.uid() = user_id or public.is_admin());

create policy "Users manage own scores"
on public.scores for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "Published draws are visible"
on public.draws for select
using (status = 'published' or public.is_admin() or auth.uid() is not null);

create policy "Admins manage draws"
on public.draws for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users read own draw results"
on public.draw_results for select
using (auth.uid() = user_id or public.is_admin());

create policy "Admins manage draw results"
on public.draw_results for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users read own contributions"
on public.contributions for select
using (auth.uid() = user_id or public.is_admin());

create policy "Admins manage contributions"
on public.contributions for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users read own winners"
on public.winners for select
using (auth.uid() = user_id or public.is_admin());

create policy "Users update own winner proof"
on public.winners for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "Admins manage winners"
on public.winners for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('winner-proof', 'winner-proof', false)
on conflict (id) do nothing;

create policy "Users upload proof to own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'winner-proof'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users read own proof uploads"
on storage.objects for select
to authenticated
using (
  bucket_id = 'winner-proof'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

create policy "Users update own proof uploads"
on storage.objects for update
to authenticated
using (
  bucket_id = 'winner-proof'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
)
with check (
  bucket_id = 'winner-proof'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

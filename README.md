# Golf Charity Platform

A modern charity-first golf subscription platform built with Next.js, Supabase, and Stripe.

The product lets subscribers:
- choose a charity they want to support
- submit and manage up to 5 Stableford scores
- participate in monthly draw results based on recent form
- track winnings, proof verification, and subscription status

The platform also includes an admin area for:
- draw simulation and publishing
- subscription oversight
- charity management
- winner review workflows

## Overview

This project is designed to feel less like a traditional golf website and more like a modern impact product. The landing experience emphasizes:
- charity impact
- clean UI
- smooth animations
- clear subscription conversion

Core platform flows:
- public marketing pages
- authentication
- subscriber dashboard
- admin dashboard
- Stripe subscription handling
- Supabase-backed data and storage

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- Stripe
- React Hook Form
- Zod
- TanStack Query
- Sonner

## Main Features

### Public Experience
- polished landing page with charity-first messaging
- charity listing and charity detail pages
- pricing page
- how-it-works page

### Subscriber Dashboard
- overview dashboard
- dedicated scores page
- dedicated draw participation page
- dedicated winnings page
- dedicated settings page
- subscription management page

### Score Management
- add Stableford scores
- edit existing scores inline
- delete scores
- automatic 5-score retention rule

### Draw System
- published draw history
- matched numbers tracking
- match count tracking
- winnings visibility
- admin simulation and publish flow

### Winnings and Verification
- winnings summary
- winner proof upload flow
- verification status tracking
- payment status tracking

### Admin Tools
- draw management
- subscription management
- charity management
- winner review workflows

## Project Structure

```text
src/
  app/
    (auth)/
    (marketing)/
    (public)/
    admin/
    api/
    dashboard/
  components/
    admin/
    charity/
    dashboard/
    forms/
    layout/
    providers/
    ui/
  lib/
    auth/
    constants/
    data/
    email/
    stripe/
    supabase/
    validators/
supabase/
  migrations/
  schema.sql
```

## App Routes

### Public
- `/`
- `/charities`
- `/charities/[slug]`
- `/pricing`
- `/how-it-works`
- `/login`
- `/signup`

### Dashboard
- `/dashboard`
- `/dashboard/scores`
- `/dashboard/draws`
- `/dashboard/winnings`
- `/dashboard/settings`
- `/dashboard/subscription`

### Admin
- `/admin`
- `/admin/draws`
- `/admin/subscriptions`
- `/admin/charities`
- `/admin/winners`

## API Routes

- `POST /api/scores`
- `PUT /api/scores`
- `DELETE /api/scores`
- `PATCH /api/user/charity-percentage`
- `POST /api/draws/simulate`
- `POST /api/draws/publish`
- `POST /api/winners/submit-proof`
- `POST /api/checkout`
- `POST /api/billing-portal`
- `POST /api/stripe/webhook`

## Environment Variables

Create a local env file:

```bash
.env.local
```

You can start from:

```bash
.env.example
```

Recommended local example:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_MOCK_MODE=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_MONTHLY_PRICE_ID=
STRIPE_YEARLY_PRICE_ID=
RESEND_API_KEY=
EMAIL_FROM=impact@yourdomain.com
MOCK_ADMIN_PASSWORD=
```

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Mock Mode

This project supports mock mode for local development.

When enabled with:

```env
NEXT_PUBLIC_ENABLE_MOCK_MODE=true
```

the app can run without a live Supabase or Stripe backend for basic UI and dashboard flows.

Important:
- do not commit real passwords
- set `MOCK_ADMIN_PASSWORD` only in `.env.local`

## Database

The database schema lives in:

- `supabase/schema.sql`
- `supabase/migrations/20260422_initial_schema.sql`

Both files are aligned, and `schema.sql` is treated as the source of truth.

Core tables include:
- `users`
- `charities`
- `subscriptions`
- `scores`
- `draws`
- `draw_results`
- `contributions`
- `winners`

## Authentication and Access

### Subscriber
Subscribers can:
- manage scores
- view draw participation
- track winnings
- update charity percentage
- manage subscription actions

### Admin
Admins can:
- access `/admin/*`
- simulate and publish draws
- review subscriptions
- manage charities
- process winner verification workflows

Middleware protects:
- dashboard routes
- admin routes
- login and signup redirects for authenticated users

## Deployment

This app is suitable for deployment on Vercel.

Typical production setup:
- frontend on Vercel
- database and auth on Supabase
- billing on Stripe
- email via Resend

Before deploying:
- configure all production environment variables
- connect Stripe price IDs
- configure Supabase auth and storage
- set webhook secrets correctly

## Verification

Useful commands before pushing:

```bash
npm run lint
npm run typecheck
npm run build
```

## GitHub Upload

If you want to push this project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

If the remote already exists:

```bash
git remote -v
```

## Notes

- `.env.local` should stay ignored
- use `.env.local.example` or `.env.example` for shared setup references
- avoid committing any real credentials

## License

This project is provided for learning, development, and portfolio/demo use unless you define a separate license.

# Trosky

AI-powered hotel revenue management — competitive rate tracking, occupancy analytics, and pricing recommendations.

## Quick start

```bash
# 1. Install
pnpm install

# 2. Set up environment
cp .env.example .env
# Edit .env — see "Environment variables" below

# 3. Database
pnpm --filter @hotel-pricing/db exec prisma generate
pnpm --filter @hotel-pricing/db exec prisma migrate dev --name init
pnpm db:seed

# 4. Run
pnpm --filter @hotel-pricing/web dev
```

Open **http://localhost:3000** and log in:

| Role | Email | Password |
|------|-------|----------|
| Analyst | analyst@example.com | Password123! |
| Client | client@example.com | Password123! |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Monorepo (Turborepo)                 │
│                                                          │
│  apps/web ──────── Next.js 14 (App Router)               │
│  │  Server actions, API routes, Tailwind + shadcn/ui     │
│  │  Recharts for charts, Framer Motion for landing       │
│  │                                                       │
│  apps/worker ───── BullMQ worker                         │
│  │  Scrape queue (mock + Expedia + Booking stub)         │
│  │  Signal ingestion, matching, recommendation engine    │
│  │                                                       │
│  packages/db ───── Prisma schema, migrations, seed       │
│  packages/shared ─ Zod schemas, types, business logic    │
│                                                          │
│  Infrastructure: PostgreSQL 16 + Redis 7                 │
└──────────────────────────────────────────────────────────┘
```

**Data flow:** Scraper → DailyRate → Recommendation engine → Dashboard. Occupancy is manual entry (or future PMS integration). Analysts manage hotels, competitors, events, and promotions. Clients get read-only access to their assigned hotel.

---

## Environment variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | No | Redis URL — needed for scrape/refresh jobs |
| `JWT_SECRET` | Yes | Access token signing key. **Must be set in production** (app will crash without it) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token signing key. **Must be set in production** |
| `SCRAPE_MODE` | No | `mock` (default) or `real` (uses Playwright) |
| `OPENAI_API_KEY` | No | For AI-powered rate explanations |
| `ANTHROPIC_API_KEY` | No | Alternative AI provider |
| `DISCOUNT_ADR_THRESHOLD` | No | ADR warning threshold % below BAR (default: 12) |
| `DISCOUNT_SHARE_THRESHOLD` | No | Discount share warning threshold % (default: 35) |
| `NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS` | No | Set to `true` to show demo login credentials |

**Security note:** In production, `JWT_SECRET` and `JWT_REFRESH_SECRET` must be long random strings (e.g. `openssl rand -hex 32`). The app throws on startup if these are missing in production.

---

## Infrastructure options

### Option A: Docker (local development)

```bash
docker compose up -d    # Starts PostgreSQL + Redis
```

Default connection strings in `.env.example` point to `localhost:5432` and `localhost:6379`.

### Option B: Hosted (no Docker needed)

1. **PostgreSQL** — [Neon](https://neon.tech) (free tier) or Supabase or Railway
2. **Redis** — [Upstash](https://upstash.com) (free tier, serverless)

Set `DATABASE_URL` and `REDIS_URL` in `.env` to your hosted instances.

---

## Running the worker

The worker processes scrape jobs and recomputes recommendations. It's optional for basic UI browsing.

```bash
pnpm --filter @hotel-pricing/worker dev
```

Without the worker, "Run scrape now" and "Refresh" return an error; everything else works.

---

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm install` | Install all workspace deps |
| `pnpm --filter @hotel-pricing/web dev` | Start web app (port 3000) |
| `pnpm --filter @hotel-pricing/worker dev` | Start BullMQ worker |
| `pnpm build` | Build all packages |
| `pnpm db:seed` | Seed demo data (1 hotel, 5 competitors, 2 users) |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:generate` | Regenerate Prisma client |

---

## Pages and routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page (redirects to dashboard if logged in) |
| `/login` | Public | Email/password login |
| `/dashboard` | All | Multi-hotel overview (analyst) or redirect to assigned hotel (client) |
| `/hotels` | Analyst | Hotel list + create |
| `/hotels/[id]` | All | Hotel dashboard — rate matrix, calendar, summary cards |
| `/hotels/[id]/settings` | Analyst | Hotel config — general, competitors, rate plans |
| `/occupancy` | Analyst | Bulk occupancy/OTB entry (30 days) |
| `/pace` | All | Pace vs last year + STR-like ADR index |
| `/events` | All | Events + external signal management |
| `/messages` | All | Threaded messaging per hotel |
| `/promotions` | Analyst | Promotion CRUD |
| `/portfolio` | Analyst | Cross-hotel KPI overview |
| `/admin/scrapes` | Analyst | Scrape run history + manual trigger |

---

## Roles

**Analyst** — Full access: manage hotels, competitors, occupancy, events, promotions, rate plans, price overrides, scraping, CSV exports.

**Client** — Read-only access to one assigned hotel: dashboard, rate matrix, calendar, day detail, pace. No edit buttons, no admin pages.

Access is enforced at three levels: middleware (JWT), server actions (RBAC helpers), and UI (conditional rendering).

---

## Data model (18 entities)

**Core:** User, Hotel, HotelAccess, Competitor, HotelCompetitor, HotelListing, CompetitorListing

**Rates:** DailyRate, ReviewSnapshot, PriceOverride, Recommendation

**Operations:** OccupancyEntry, Event, Promotion, RatePlan, DiscountMix

**Pipeline:** ScrapeRun, ScrapeError, ExternalSignal, HotelSignalImpact

See [Product documentation](docs/PRODUCT-DOCUMENTATION.md) for full entity descriptions and relationships.

---

## Deploy to production

See [Deploying to Vercel](docs/DEPLOY.md) for step-by-step deployment instructions covering:
- Vercel project setup (monorepo configuration)
- Database setup (Neon/Supabase/Railway)
- Redis setup (Upstash)
- Environment variables
- Running migrations against production DB
- Worker deployment (Railway/Render)

---

## Documentation

| Document | What it covers |
|----------|---------------|
| [Product documentation](docs/PRODUCT-DOCUMENTATION.md) | Full spec: roles, auth flows, user flows, feature reference, data model, business rules, glossary |
| [Dashboard guide](docs/DASHBOARD-GUIDE.md) | Screen-by-screen walkthrough of every UI component |
| [Deploy guide](docs/DEPLOY.md) | Vercel + database + worker deployment |
| [Design & colors](docs/DESIGN-COLORS.md) | Color palette, chart colors, typography, iconography |
| [API reference](docs/API.md) | Endpoints, server actions, error codes |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and fixes |

---

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Framer Motion
- **Backend:** Server actions, API routes, custom JWT auth (jose + bcrypt)
- **Database:** PostgreSQL 16, Prisma ORM
- **Queue:** Redis 7, BullMQ
- **Scraping:** Playwright (real mode), adapter pattern (mock/Expedia/Booking stub)
- **Validation:** Zod
- **Monorepo:** Turborepo, pnpm workspaces

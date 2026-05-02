# Troubleshooting — Trosky

Common issues and how to fix them.

---

## Local development

### "Cannot find module '@hotel-pricing/db'" or similar

Prisma client hasn't been generated yet.

```bash
pnpm --filter @hotel-pricing/db exec prisma generate
```

### "Can't reach database server"

PostgreSQL isn't running.

- **Docker:** `docker compose up -d` then `docker compose ps` to verify
- **Hosted (Neon/Supabase):** Check your `DATABASE_URL` in `.env` — make sure it includes `?sslmode=require` for hosted providers

### "connect ECONNREFUSED 127.0.0.1:6379"

Redis isn't running. Either:
- Start Redis: `docker compose up -d`
- Or remove `REDIS_URL` from `.env` — the app works without it (scrape/refresh won't work)

### Login returns "Invalid email or password"

Database isn't seeded. Run:

```bash
pnpm db:seed
```

This creates `analyst@example.com` and `client@example.com` with password `Password123!`.

### "Error: Missing required environment variable: JWT_SECRET"

You're running in production mode without setting `JWT_SECRET`. Either:
- Set it in `.env`: `JWT_SECRET=<any-long-random-string>`
- Or run in development mode: `NODE_ENV=development`

### Prisma migration errors

If migrations are out of sync:

```bash
# Reset and re-apply (destroys data)
pnpm --filter @hotel-pricing/db exec prisma migrate reset

# Or push schema without migration history
pnpm --filter @hotel-pricing/db exec prisma db push
pnpm db:seed
```

### Port 3000 already in use

Another process is using port 3000. Kill it or use a different port:

```bash
lsof -ti:3000 | xargs kill
# or
PORT=3001 pnpm --filter @hotel-pricing/web dev
```

---

## Vercel deployment

### "No Output Directory named 'public' found"

Framework Preset is wrong. Fix:
1. Settings → Build & Development → Framework Preset → **Next.js**
2. Output Directory → leave empty or turn Override off
3. Redeploy

### Build fails with "prisma generate" errors

Build Command is overridden. Fix:
1. Settings → Build & Development → clear Build Command (leave empty)
2. The repo's `apps/web/vercel.json` handles the build
3. Redeploy

### Login returns 500 in production

Missing environment variables. Check:
1. Settings → Environment Variables
2. Verify `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET` are set
3. Redeploy after adding them

### "Refresh is not configured" error

`REDIS_URL` is not set. Add it in Settings → Environment Variables if you want scrape/refresh. Without it, the rest of the app works fine.

### Dashboard shows no data

Database hasn't been seeded. From your local machine (with the same `DATABASE_URL` as Vercel):

```bash
pnpm --filter @hotel-pricing/db exec prisma migrate deploy
pnpm db:seed
```

### "Run scrape now" does nothing

The worker isn't deployed. The worker is a separate long-running process — it can't run on Vercel. Deploy it on Railway, Render, or a VPS. See [Deploy guide](DEPLOY.md#6-worker-deployment-optional).

---

## Data issues

### Rates are stale / not updating

- Check if the worker is running (it runs the daily scrape at 04:00 UTC)
- Try "Refresh" on the hotel dashboard to queue a manual scrape
- Check Scrape Admin (`/admin/scrapes`) for error counts
- In mock mode, prices are deterministic — they only change when dates change

### Recommendations seem wrong

Recommendations depend on:
1. Competitor rates (need at least one competitor with data)
2. Occupancy data (manually entered on the Occupancy page)
3. Hotel min/max rate settings (clamps the recommendation)

Check Hotel Settings → ensure competitors have valid weights and min/max rates are set.

### "No hotels" on dashboard

- **Analyst:** No active hotels in the database. Run `pnpm db:seed` or create one at `/hotels/new`
- **Client:** No `HotelAccess` record linking the user to a hotel. Check the database.

---

## macOS-specific

### `._*` files appearing

These are macOS resource fork files. They're in `.gitignore` and harmless. To clean them up locally:

```bash
find . -name "._*" -not -path "*/node_modules/*" -not -path "*/.next/*" -delete
```

# Sree Muthappan Temple - Indira Nagar

Temple services web application built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and a devotional visual system.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Fill in your Neon, auth, payment, and SMTP values.
3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Neon Quickstart

This app already uses Prisma with PostgreSQL, so Neon setup is just environment configuration.

1. Create a Neon project and open the `Connect` panel.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Keep `AUTH_SECRET`, Razorpay, and SMTP values in `.env.local`.
5. Push the schema to Neon:

```bash
npx prisma db push
```

6. Start the app:

```bash
npm run dev
```

Neon detail: use the `-pooler` hostname for `DATABASE_URL` so the app uses connection pooling, and use the non-pooled hostname for `DIRECT_URL` so Prisma CLI commands talk to Neon directly.

## Move Existing Data To Neon

If your current data is still in another Postgres database, migrate it with:

```bash
SOURCE_DATABASE_URL="postgresql://CURRENT_DB_URL" \
NEON_DIRECT_URL="postgresql://NEON_DIRECT_URL" \
npm run db:migrate:neon
```

If the Neon database already contains tables you want to replace, add `NEON_RESET_TARGET=1` before the command to drop and recreate the target `public` schema first.

After the restore finishes, point the app at Neon:

```bash
DATABASE_URL="postgresql://NEON_POOLED_URL"
DIRECT_URL="postgresql://NEON_DIRECT_URL"
```

## Build

```bash
npm run build
npm start
```

## Current scope

- Rich homepage, pooja booking UI, prasad, darshan, auth, dashboards, and admin pages
- Prisma schema for bookings, poojas, users, prasad, and darshan reminders
- Typed utility layer for Prisma, mail, Razorpay, and auth scaffolding
- API route placeholders for bookings, orders, payments, certificates, and admin stats

## Notes

- The UI is production-buildable.
- Authentication, payments, database persistence, and certificate generation are wired for real credentials and service configuration.

## Render Deploy

This repo includes a `render.yaml` Blueprint for a Render `Web Service` plus a managed `Render Postgres` database.

1. Push this repo to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select this repository.
4. Render will create:
   - a web service for the Next.js app
   - a managed Postgres database
5. Fill the prompted secrets before the first deploy:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
6. After deploy, set both `APP_URL` and `NEXT_PUBLIC_APP_URL` to your final Render URL or custom domain.
7. For the first admin account, temporarily add these env vars in Render:
   - `ADMIN_BOOTSTRAP_EMAIL`
   - `ADMIN_BOOTSTRAP_PASSWORD`
   - `ADMIN_BOOTSTRAP_TOKEN`
8. Open `/api/dev/create-admin?token=YOUR_ADMIN_BOOTSTRAP_TOKEN` once, log in with that account, then remove the bootstrap env vars.

The deploy uses `prisma db push` because the repo does not currently include Prisma migrations.
Free Render note: free web services cannot send SMTP traffic on ports `25`, `465`, or `587`, and free Postgres expires after 30 days.

If you deploy this app with Neon instead of Render Postgres, set both `DATABASE_URL` and `DIRECT_URL` in your hosting provider and skip the managed Render database portion of the blueprint.

## Payment Setup

1. Create a Razorpay account and get your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
2. Copy the same public key into `NEXT_PUBLIC_RAZORPAY_KEY_ID`.
3. Enable automatic capture in your Razorpay dashboard for the booking flow.
4. Restart the app after updating `.env.local`.

## Email Setup

1. Set `SMTP_FROM` to the sender address you want devotees to see.
2. Fill `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS`.
3. Booking confirmation emails are sent after successful booking payment verification.
4. Booking completion emails are sent when admin marks a booking as `COMPLETED`.
# templeOs

# Sree Muthappan Temple - Indira Nagar

Temple services web application built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and a devotional visual system.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Fill in your database, auth, payment, Cloudinary, and SMTP values.
3. Install dependencies:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

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

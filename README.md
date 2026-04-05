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

import nodemailer from "nodemailer";

type BookingMailPayload = {
  to: string;
  recipientName?: string | null;
  bookingId: string;
  poojaName: string;
  scheduledDate: string;
  devoteeName: string;
  nakshatra: string;
  gotra?: string | null;
  prasadRequested: boolean;
  paymentStatus: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000";
}

export function isMailerConfigured() {
  return Boolean(
    process.env.SMTP_FROM &&
      ((process.env.SMTP_HOST && process.env.SMTP_PORT) || (process.env.SMTP_USER && process.env.SMTP_PASS)),
  );
}

export function getMailer() {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  if (!isMailerConfigured()) return false;

  await getMailer().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });

  return true;
}

export async function sendBookingConfirmationEmail(payload: BookingMailPayload) {
  const recipientName = payload.recipientName?.trim() || payload.devoteeName;
  const bookingsUrl = `${getBaseUrl()}/my-bookings`;
  const deliveryLine = payload.prasadRequested ? "Home prasadam delivery requested" : "Temple collection only";
  const gotraLine = payload.gotra?.trim() ? payload.gotra.trim() : "Not specified";

  return sendMail({
    to: payload.to,
    subject: `Booking Confirmed: ${payload.poojaName}`,
    text: [
      `Namaskaram ${recipientName},`,
      "",
      `Your booking for ${payload.poojaName} has been confirmed.`,
      `Booking ID: ${payload.bookingId}`,
      `Scheduled Date: ${payload.scheduledDate}`,
      `Devotee: ${payload.devoteeName}`,
      `Nakshatra: ${payload.nakshatra}`,
      `Gotra: ${gotraLine}`,
      `Prasadam Delivery: ${deliveryLine}`,
      `Payment Status: ${payload.paymentStatus}`,
      "",
      `View your booking history: ${bookingsUrl}`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #1c1917; line-height: 1.6;">
        <p>Namaskaram ${recipientName},</p>
        <p>Your booking for <strong>${payload.poojaName}</strong> has been confirmed.</p>
        <table style="border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Booking ID</strong></td><td>${payload.bookingId}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Scheduled Date</strong></td><td>${payload.scheduledDate}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Devotee</strong></td><td>${payload.devoteeName}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Nakshatra</strong></td><td>${payload.nakshatra}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Gotra</strong></td><td>${gotraLine}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Prasadam Delivery</strong></td><td>${deliveryLine}</td></tr>
          <tr><td style="padding: 4px 12px 4px 0;"><strong>Payment Status</strong></td><td>${payload.paymentStatus}</td></tr>
        </table>
        <p><a href="${bookingsUrl}">View your bookings</a></p>
      </div>
    `,
  });
}

export async function sendBookingCompletionEmail(payload: BookingMailPayload) {
  const recipientName = payload.recipientName?.trim() || payload.devoteeName;
  const bookingsUrl = `${getBaseUrl()}/my-bookings`;

  return sendMail({
    to: payload.to,
    subject: `Booking Completed: ${payload.poojaName}`,
    text: [
      `Namaskaram ${recipientName},`,
      "",
      `Your booking for ${payload.poojaName} has been marked as completed.`,
      `Booking ID: ${payload.bookingId}`,
      `Scheduled Date: ${payload.scheduledDate}`,
      "",
      `View your booking history: ${bookingsUrl}`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #1c1917; line-height: 1.6;">
        <p>Namaskaram ${recipientName},</p>
        <p>Your booking for <strong>${payload.poojaName}</strong> has been marked as completed.</p>
        <p><strong>Booking ID:</strong> ${payload.bookingId}</p>
        <p><strong>Scheduled Date:</strong> ${payload.scheduledDate}</p>
        <p><a href="${bookingsUrl}">View your bookings</a></p>
      </div>
    `,
  });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendBookingConfirmationEmail } from "@/lib/mailer";
import {
  getRazorpayClient,
  isRazorpayConfigured,
  verifyRazorpaySignature,
} from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!isRazorpayConfigured()) {
    return new NextResponse("Razorpay is not configured on the server.", { status: 500 });
  }

  try {
    const payload = (await request.json()) as {
      poojaId: string;
      devoteeName: string;
      nakshatra: string;
      gotra?: string;
      scheduledDate: string;
      prasadRequested: boolean;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    const existingBooking = await db.booking.findFirst({
      where: {
        userId: session.user.id,
        paymentId: payload.razorpay_payment_id,
      },
      include: {
        pooja: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (existingBooking) {
      return NextResponse.json({ verified: true, booking: existingBooking });
    }

    const signatureIsValid = verifyRazorpaySignature({
      orderId: payload.razorpay_order_id,
      paymentId: payload.razorpay_payment_id,
      signature: payload.razorpay_signature,
    });

    if (!signatureIsValid) {
      return new NextResponse("Payment signature verification failed.", { status: 400 });
    }

    const pooja = await db.pooja.findUnique({
      where: { id: payload.poojaId },
      select: { id: true, name: true, price: true, available: true },
    });

    if (!pooja || !pooja.available) {
      return new NextResponse("Pooja not available", { status: 400 });
    }

    const payment = await getRazorpayClient().payments.fetch(payload.razorpay_payment_id);
    if (payment.order_id !== payload.razorpay_order_id) {
      return new NextResponse("Payment order mismatch.", { status: 400 });
    }

    if (!["authorized", "captured"].includes(payment.status)) {
      return new NextResponse("Payment is not complete.", { status: 400 });
    }

    if (payment.amount !== pooja.price * 100) {
      return new NextResponse("Payment amount mismatch.", { status: 400 });
    }

    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        poojaId: pooja.id,
        devoteeName: payload.devoteeName.trim(),
        nakshatra: payload.nakshatra,
        gotra: payload.gotra?.trim() || null,
        scheduledDate: new Date(payload.scheduledDate),
        prasadRequested: Boolean(payload.prasadRequested),
        paymentId: payload.razorpay_payment_id,
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
      include: {
        pooja: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (booking.user.email) {
      try {
        await sendBookingConfirmationEmail({
          to: booking.user.email,
          recipientName: booking.user.name,
          bookingId: booking.id,
          poojaName: booking.pooja.name,
          scheduledDate: new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(booking.scheduledDate),
          devoteeName: booking.devoteeName,
          nakshatra: booking.nakshatra,
          gotra: booking.gotra,
          prasadRequested: booking.prasadRequested,
          paymentStatus: booking.paymentStatus,
        });
      } catch (mailError) {
        console.error("Failed to send booking confirmation email", mailError);
      }
    }

    return NextResponse.json({ verified: true, booking });
  } catch (error) {
    console.error("Payment verification failed", error);
    return new NextResponse("Payment verification failed", { status: 500 });
  }
}

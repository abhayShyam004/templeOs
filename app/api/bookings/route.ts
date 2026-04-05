import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendBookingConfirmationEmail } from "@/lib/mailer";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const bookings = await db.booking.findMany({
    where: { userId: session.user.id },
    include: { pooja: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      devoteeName: string;
      nakshatra: string;
      gotra?: string;
      scheduledDate: string;
      prasadRequested: boolean;
      poojaId: string;
      paymentId?: string;
    };

    const pooja = await db.pooja.findUnique({ where: { id: payload.poojaId } });
    if (!pooja || !pooja.available) {
      return new NextResponse("Pooja not available", { status: 400 });
    }

    const booking = await db.booking.create({
      data: {
        userId: session.user.id,
        poojaId: payload.poojaId,
        devoteeName: payload.devoteeName,
        nakshatra: payload.nakshatra,
        gotra: payload.gotra || null,
        scheduledDate: new Date(payload.scheduledDate),
        prasadRequested: Boolean(payload.prasadRequested),
        paymentId: payload.paymentId || null,
        paymentStatus: payload.paymentId ? "PAID" : "UNPAID",
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

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking", error);
    return new NextResponse("Failed to create booking", { status: 500 });
  }
}

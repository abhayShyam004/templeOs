import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";
import { sendBookingCompletionEmail } from "@/lib/mailer";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: String(body.status),
      },
      include: {
        pooja: true,
        user: { select: { name: true, email: true } },
      },
    });

    if (String(body.status) === "COMPLETED" && updatedBooking.user.email) {
      try {
        await sendBookingCompletionEmail({
          to: updatedBooking.user.email,
          recipientName: updatedBooking.user.name,
          bookingId: updatedBooking.id,
          poojaName: updatedBooking.pooja.name,
          scheduledDate: new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(updatedBooking.scheduledDate),
          devoteeName: updatedBooking.devoteeName,
          nakshatra: updatedBooking.nakshatra,
          gotra: updatedBooking.gotra,
          prasadRequested: updatedBooking.prasadRequested,
          paymentStatus: updatedBooking.paymentStatus,
        });
      } catch (mailError) {
        console.error(`Failed to send completion email for booking ${params.id}:`, mailError);
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error(`Failed to update booking with ID ${params.id}:`, error);
    return new NextResponse("Failed to update booking", { status: 500 });
  }
}

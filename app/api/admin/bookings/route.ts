import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any; // BookingStatus enum
    const userId = searchParams.get("userId") as string;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && { status }),
        ...(userId && { userId }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        pooja: {
          select: { name: true, price: true, duration: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return new NextResponse("Failed to fetch bookings", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRazorpayClient, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

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
      poojaId?: string;
    };

    if (!payload.poojaId) {
      return new NextResponse("Pooja ID is required.", { status: 400 });
    }

    const pooja = await db.pooja.findUnique({
      where: { id: payload.poojaId },
      select: { id: true, name: true, price: true, available: true },
    });

    if (!pooja || !pooja.available) {
      return new NextResponse("Pooja not available", { status: 400 });
    }

    const amount = pooja.price * 100;
    const order = await getRazorpayClient().orders.create({
      amount,
      currency: "INR",
      receipt: `booking_${pooja.id}_${Date.now()}`.slice(0, 40),
      notes: {
        poojaId: pooja.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      name: "Sri Muthappa Madapura",
      description: `Booking for ${pooja.name}`,
      pooja: {
        id: pooja.id,
        name: pooja.name,
        price: pooja.price,
      },
    });
  } catch (error) {
    console.error("Failed to create payment order", error);
    return new NextResponse("Failed to create payment order", { status: 500 });
  }
}

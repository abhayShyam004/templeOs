import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCheckoutPricing } from "@/lib/order-checkout";
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
      items?: Array<{ id: string; quantity: number; type: "prasadam" | "goodie" }>;
      address?: string;
      pincode?: string;
      phone?: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    const address = payload.address?.trim();
    const pincode = payload.pincode?.trim();
    const phone = payload.phone?.trim();

    if (!address || !pincode || !phone) {
      return new NextResponse("Phone, address, and pincode are required", { status: 400 });
    }

    const existingPrasadOrder = await db.prasadOrder.findFirst({
      where: {
        userId: session.user.id,
        paymentId: payload.razorpay_payment_id,
      },
      select: { id: true },
    });
    const existingGoodieOrder = await db.goodieOrder.findFirst({
      where: {
        userId: session.user.id,
        paymentId: payload.razorpay_payment_id,
      },
      select: { id: true },
    });

    if (existingPrasadOrder || existingGoodieOrder) {
      return NextResponse.json({
        verified: true,
        prasadOrderId: existingPrasadOrder?.id ?? null,
        goodieOrderId: existingGoodieOrder?.id ?? null,
      });
    }

    const signatureIsValid = verifyRazorpaySignature({
      orderId: payload.razorpay_order_id,
      paymentId: payload.razorpay_payment_id,
      signature: payload.razorpay_signature,
    });

    if (!signatureIsValid) {
      return new NextResponse("Payment signature verification failed.", { status: 400 });
    }

    const pricing = await getCheckoutPricing(payload.items);
    const payment = await getRazorpayClient().payments.fetch(payload.razorpay_payment_id);

    if (payment.order_id !== payload.razorpay_order_id) {
      return new NextResponse("Payment order mismatch.", { status: 400 });
    }

    if (!["authorized", "captured"].includes(payment.status)) {
      return new NextResponse("Payment is not complete.", { status: 400 });
    }

    if (payment.amount !== pricing.totalAmount * 100) {
      return new NextResponse("Payment amount mismatch.", { status: 400 });
    }

    const createdOrders = await db.$transaction(async (tx) => {
      const prasadOrder =
        pricing.prasadamItems.length > 0
          ? await tx.prasadOrder.create({
              data: {
                userId: session.user.id,
                totalAmount: pricing.totalPrasadAmount,
                address,
                pincode,
                phone,
                status: "PROCESSING",
                paymentId: payload.razorpay_payment_id,
                items: {
                  create: pricing.prasadamItems.map((item) => ({
                    itemId: item.id,
                    quantity: item.quantity,
                  })),
                },
              },
              select: { id: true },
            })
          : null;

      const goodieOrder =
        pricing.goodieItems.length > 0
          ? await tx.goodieOrder.create({
              data: {
                userId: session.user.id,
                totalAmount: pricing.totalGoodieAmount,
                address,
                pincode,
                phone,
                status: "PROCESSING",
                paymentId: payload.razorpay_payment_id,
                items: {
                  create: pricing.goodieItems.map((item) => ({
                    itemId: item.id,
                    quantity: item.quantity,
                  })),
                },
              },
              select: { id: true },
            })
          : null;

      return {
        prasadOrderId: prasadOrder?.id ?? null,
        goodieOrderId: goodieOrder?.id ?? null,
      };
    });

    return NextResponse.json({
      verified: true,
      ...createdOrders,
    });
  } catch (error) {
    console.error("Cart payment verification failed", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Cart payment verification failed",
      { status: 400 },
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCheckoutPricing } from "@/lib/order-checkout";
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
      items?: Array<{ id: string; quantity: number; type: "prasadam" | "goodie" }>;
      address?: string;
      pincode?: string;
      phone?: string;
    };

    const address = payload.address?.trim();
    const pincode = payload.pincode?.trim();
    const phone = payload.phone?.trim();

    if (!address || !pincode || !phone) {
      return new NextResponse("Phone, address, and pincode are required", { status: 400 });
    }

    const pricing = await getCheckoutPricing(payload.items);

    const order = await getRazorpayClient().orders.create({
      amount: pricing.totalAmount * 100,
      currency: "INR",
      receipt: `cart_${session.user.id}_${Date.now()}`.slice(0, 40),
      notes: {
        userId: session.user.id,
        itemCount: String(pricing.items.length),
        checkoutType: "cart",
      },
    });

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      name: "Sri Muthappa Madapura",
      description: "Payment for cart order",
    });
  } catch (error) {
    console.error("Failed to create cart payment order", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to create cart payment order",
      { status: 400 },
    );
  }
}

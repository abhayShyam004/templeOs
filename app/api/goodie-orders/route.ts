import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const orders = await db.goodieOrder.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          item: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      items: Array<{ itemId: string; quantity: number }>;
      address: string;
      pincode: string;
      phone: string;
    };

    if (!payload.items?.length) {
      return new NextResponse("No items in order", { status: 400 });
    }

    const ids = payload.items.map((item) => item.itemId);
    const catalog = await db.goodieItem.findMany({ where: { id: { in: ids }, inStock: true } });

    if (catalog.length !== ids.length) {
      return new NextResponse("One or more items are unavailable", { status: 400 });
    }

    const priceMap = new Map(catalog.map((item) => [item.id, item.price]));
    const totalAmount = payload.items.reduce(
      (sum, item) => sum + (priceMap.get(item.itemId) || 0) * Math.max(1, Number(item.quantity || 1)),
      0,
    );

    const order = await db.goodieOrder.create({
      data: {
        userId: session.user.id,
        totalAmount,
        address: payload.address,
        pincode: payload.pincode,
        phone: payload.phone,
        status: "PROCESSING",
        items: {
          create: payload.items.map((item) => ({
            itemId: item.itemId,
            quantity: Math.max(1, Number(item.quantity || 1)),
          })),
        },
      },
      include: {
        items: { include: { item: true } },
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create goodie order", error);
    return new NextResponse("Failed to create goodie order", { status: 500 });
  }
}

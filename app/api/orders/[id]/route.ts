import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const order = await db.prasadOrder.findUnique({
    where: { id: params.id },
    include: { items: { include: { item: true } }, user: true },
  });

  if (!order) return new NextResponse("Not found", { status: 404 });

  const isAdmin = session.user.role === "ADMIN";
  if (!isAdmin && order.userId !== session.user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const payload = (await request.json()) as {
      status?: string;
      trackingId?: string;
      paymentId?: string;
    };

    const order = await db.prasadOrder.update({
      where: { id: params.id },
      data: {
        status: payload.status,
        trackingId: payload.trackingId,
        paymentId: payload.paymentId,
      },
      include: { items: { include: { item: true } } },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Failed to update order", error);
    return new NextResponse("Failed to update order", { status: 500 });
  }
}

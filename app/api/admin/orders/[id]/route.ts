import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const updatedOrder = await prisma.prasadOrder.update({
      where: { id: params.id },
      data: {
        status: String(body.status),
        trackingId: body.trackingId,
      },
    });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`Failed to update order with ID ${params.id}:`, error);
    return new NextResponse("Failed to update order", { status: 500 });
  }
}

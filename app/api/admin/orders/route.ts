import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as any; // OrderStatus enum
    const userId = searchParams.get("userId") as string;

    const orders = await prisma.prasadOrder.findMany({
      where: {
        ...(status && { status }),
        ...(userId && { userId }),
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            item: {
              select: { name: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return new NextResponse("Failed to fetch orders", { status: 500 });
  }
}

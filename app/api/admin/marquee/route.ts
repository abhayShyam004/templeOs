import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.marqueeItem.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return NextResponse.json(items);
  } catch (error) {
    return new NextResponse("Failed to fetch marquee items", { status: 500 });
  }
}

export async function POST(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const { text, link, sortOrder } = await request.json();
    const item = await prisma.marqueeItem.create({
      data: { text, link, sortOrder: sortOrder || 0 }
    });
    return NextResponse.json(item);
  } catch (error) {
    return new NextResponse("Failed to create marquee item", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const { id, text, link, sortOrder, active } = body;
    const item = await prisma.marqueeItem.update({
      where: { id },
      data: { text, link, sortOrder, active }
    });
    return NextResponse.json(item);
  } catch (error) {
    return new NextResponse("Failed to update marquee item", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return new NextResponse("Missing ID", { status: 400 });

    await prisma.marqueeItem.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Failed to delete marquee item", { status: 500 });
  }
}

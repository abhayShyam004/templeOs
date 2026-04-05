import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        role: String(body.role),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(`Failed to update user with ID ${params.id}:`, error);
    return new NextResponse("Failed to update user", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    return new NextResponse("User deleted successfully", { status: 204 });
  } catch (error) {
    console.error(`Failed to delete user with ID ${params.id}:`, error);
    return new NextResponse("Failed to delete user", { status: 500 });
  }
}

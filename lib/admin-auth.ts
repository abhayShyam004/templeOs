import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function checkAdminAuth() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return null; // Return null if authorized
}

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Handle your admin logic here
  return NextResponse.json({ message: "Welcome to the admin API!" });
}

// Add POST, PUT, DELETE handlers with similar auth checks

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  void request;

  return new NextResponse(
    "Direct order creation is disabled. Complete the Razorpay checkout flow first.",
    { status: 400 },
  );
}

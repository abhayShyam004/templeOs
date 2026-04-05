import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name: string; email: string; password: string };

    const email = body.email.trim().toLowerCase();
    const name = body.name.trim();

    if (name.length < 2 || email.length < 5 || body.password.length < 6) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return new NextResponse("User already exists", { status: 409 });
    }

    const hash = await bcrypt.hash(body.password, 10);

    await db.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Registration failed", error);
    return new NextResponse("Registration failed", { status: 500 });
  }
}

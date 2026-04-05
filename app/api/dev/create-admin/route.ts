import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const bootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
    const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
    const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (!bootstrapToken || !adminEmail || !adminPassword) {
      return notFound();
    }

    if (token !== bootstrapToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Admin bootstrap: Resetting admin credentials for", adminEmail);
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        name: "Temple Admin",
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        name: "Temple Admin",
      },
    });

    return NextResponse.json({
      message: "Admin credentials reset successfully",
      email: user.email,
      note: "Login at /login and then remove the bootstrap env vars.",
    });
  } catch (error) {
    console.error("Error resetting admin:", error);
    return NextResponse.json({ error: "Failed to reset admin" }, { status: 500 });
  }
}

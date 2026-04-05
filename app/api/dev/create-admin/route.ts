import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminEmail = "admin@templeos.in";
    const adminPassword = "admin123"; // Simplified password
    
    console.log("Dev: Resetting admin credentials for", adminEmail);
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashedPassword,
        role: "ADMIN",
        name: "Temple Admin"
      },
      create: {
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        name: "Temple Admin"
      }
    });

    return NextResponse.json({ 
      message: "Admin credentials reset successfully", 
      email: user.email,
      password: adminPassword,
      note: "Login at /login"
    });
  } catch (error) {
    console.error("Error resetting admin:", error);
    return NextResponse.json({ error: "Failed to reset admin" }, { status: 500 });
  }
}

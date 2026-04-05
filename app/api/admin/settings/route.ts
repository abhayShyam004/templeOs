import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const settings = await prisma.siteSetting.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return new NextResponse("Failed to fetch site settings", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json(); // Expects an array of { key, value, type, description }
    const updatedSettings = [];

    for (const setting of body) {
      const { key, value, type, description } = setting;
      const updated = await prisma.siteSetting.upsert({
        where: { key },
        update: { value, type, description },
        create: { key, value, type, description },
      });
      updatedSettings.push(updated);
    }

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Failed to update site settings:", error);
    return new NextResponse("Failed to update site settings", { status: 500 });
  }
}

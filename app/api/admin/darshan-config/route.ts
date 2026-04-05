import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkAdminAuth } from "@/lib/admin-auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const darshanConfig = await prisma.darshanConfig.findFirst();
    return NextResponse.json(darshanConfig);
  } catch (error) {
    console.error("Failed to fetch darshan config:", error);
    return new NextResponse("Failed to fetch darshan config", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const updatedConfig = await prisma.darshanConfig.updateMany({
      data: {
        youtubeUrl: body.youtubeUrl,
        morningTime: body.morningTime,
        eveningTime: body.eveningTime,
      },
    });
    // Since findFirst doesn't guarantee a single record, updateMany is safer.
    // However, if we know there's only one, we might want to ensure it exists or create it.
    // For simplicity, assuming a record always exists and we're updating it.
    if (updatedConfig.count === 0) {
      // If no record exists, create one
      await prisma.darshanConfig.create({
        data: {
          youtubeUrl: body.youtubeUrl,
          morningTime: body.morningTime,
          eveningTime: body.eveningTime,
        },
      });
      const newConfig = await prisma.darshanConfig.findFirst();
      return NextResponse.json(newConfig);
    }
    const latestConfig = await prisma.darshanConfig.findFirst();
    return NextResponse.json(latestConfig);
  } catch (error) {
    console.error("Failed to update darshan config:", error);
    return new NextResponse("Failed to update darshan config", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ allowEmails: false, persisted: false });
  }

  const preference = await db.notificationPreference.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({
    allowEmails: preference?.allowEmails ?? false,
    persisted: Boolean(preference),
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = (await request.json()) as { allowEmails: boolean };

    const preference = await db.notificationPreference.upsert({
      where: { userId: session.user.id },
      update: { allowEmails: Boolean(body.allowEmails) },
      create: { userId: session.user.id, allowEmails: Boolean(body.allowEmails) },
    });

    return NextResponse.json(preference);
  } catch (error) {
    console.error("Failed to save notification preference", error);
    return new NextResponse("Failed to save notification preference", { status: 500 });
  }
}

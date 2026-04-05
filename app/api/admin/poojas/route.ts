import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { encodeGallery } from "@/lib/temple-data";
import { slugify } from "@/lib/utils";

export async function GET() {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const poojas = await db.pooja.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(poojas);
}

export async function POST(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();

    const pooja = await db.pooja.create({
      data: {
        slug: body.slug || slugify(body.name),
        name: body.name,
        nameML: body.nameML || body.name,
        description: body.description,
        descriptionML: body.descriptionML || body.description,
        price: Number(body.price ?? 0),
        duration: body.duration || "30 minutes",
        image: body.image,
        gallery: encodeGallery(body.gallery),
        sortOrder: body.sortOrder ? Number(body.sortOrder) : null,
        available: Boolean(body.available ?? true),
      },
    });

    return NextResponse.json(pooja, { status: 201 });
  } catch (error) {
    console.error("Failed to create pooja", error);
    return new NextResponse("Failed to create pooja", { status: 500 });
  }
}

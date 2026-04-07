import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { encodeGallery } from "@/lib/temple-data";
import { slugify } from "@/lib/utils";

export async function GET() {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const items = await db.prasadItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const grams = Number(body.grams);

    if (!Number.isFinite(grams) || grams <= 0) {
      return new NextResponse("Prasadam weight in grams is required", { status: 400 });
    }

    const item = await db.prasadItem.create({
      data: {
        slug: body.slug || slugify(body.name),
        name: body.name,
        nameML: body.nameML || body.name,
        description: body.description,
        grams,
        price: Number(body.price ?? 0),
        image: body.image,
        gallery: encodeGallery(body.gallery),
        sortOrder: body.sortOrder ? Number(body.sortOrder) : null,
        inStock: Boolean(body.inStock ?? true),
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create prasadam item", error);
    return new NextResponse("Failed to create prasadam item", { status: 500 });
  }
}

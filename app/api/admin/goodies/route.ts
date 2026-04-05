import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { encodeGallery } from "@/lib/temple-data";
import { slugify } from "@/lib/utils";

export async function GET() {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const goodies = await db.goodieItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(goodies);
}

export async function POST(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();

    const item = await db.goodieItem.create({
      data: {
        slug: body.slug || slugify(body.name),
        name: body.name,
        description: body.description,
        price: Number(body.price ?? 0),
        image: body.image,
        gallery: encodeGallery(body.gallery),
        sortOrder: body.sortOrder ? Number(body.sortOrder) : null,
        inStock: Boolean(body.inStock ?? true),
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create goodie", error);
    return new NextResponse("Failed to create goodie", { status: 500 });
  }
}

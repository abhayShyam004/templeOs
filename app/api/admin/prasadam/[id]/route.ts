import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { encodeGallery } from "@/lib/temple-data";
import { slugify } from "@/lib/utils";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const item = await db.prasadItem.findUnique({ where: { id: params.id } });
  if (!item) return new NextResponse("Prasadam item not found", { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const grams = Number(body.grams);

    if (!Number.isFinite(grams) || grams <= 0) {
      return new NextResponse("Prasadam weight in grams is required", { status: 400 });
    }

    const item = await db.prasadItem.update({
      where: { id: params.id },
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

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update prasadam item", error);
    return new NextResponse("Failed to update prasadam item", { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    await db.prasadItem.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete prasadam item", error);
    return new NextResponse("Failed to delete prasadam item", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { encodeGallery } from "@/lib/temple-data";
import { slugify } from "@/lib/utils";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const pooja = await db.pooja.findUnique({ where: { id: params.id } });
  if (!pooja) return new NextResponse("Pooja not found", { status: 404 });

  return NextResponse.json(pooja);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();

    const pooja = await db.pooja.update({
      where: { id: params.id },
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

    return NextResponse.json(pooja);
  } catch (error) {
    console.error("Failed to update pooja", error);
    return new NextResponse("Failed to update pooja", { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    await db.pooja.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete pooja", error);
    return new NextResponse("Failed to delete pooja", { status: 500 });
  }
}

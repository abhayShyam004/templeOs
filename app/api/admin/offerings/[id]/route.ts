import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { encodeGallery } from "@/lib/temple-data";
import { slugify } from "@/lib/utils";
import { getOfferingDelegate } from "@/lib/offering-delegate";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const offeringItem = getOfferingDelegate();
  const item = await offeringItem.findUnique({ where: { id: params.id } });
  if (!item) return new NextResponse("Offering item not found", { status: 404 });

  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const offeringItem = getOfferingDelegate();

    const item = await offeringItem.update({
      where: { id: params.id },
      data: {
        slug: body.slug || slugify(body.name),
        name: body.name,
        description: body.description,
        category: body.category || "General",
        price: Number(body.price ?? 0),
        image: body.image,
        gallery: encodeGallery(body.gallery),
        sortOrder: body.sortOrder ? Number(body.sortOrder) : null,
        inStock: Boolean(body.inStock ?? true),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to update offering item", error);
    return new NextResponse("Failed to update offering item", { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const offeringItem = getOfferingDelegate();
    await offeringItem.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete offering item", error);
    return new NextResponse("Failed to delete offering item", { status: 500 });
  }
}

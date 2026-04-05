import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { encodeGallery } from "@/lib/temple-data";
import { slugify } from "@/lib/utils";
import { getOfferingDelegate } from "@/lib/offering-delegate";

export async function GET() {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  const offeringItem = getOfferingDelegate();
  const items = await offeringItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = await request.json();
    const offeringItem = getOfferingDelegate();

    const item = await offeringItem.create({
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

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create offering item", error);
    return new NextResponse("Failed to create offering item", { status: 500 });
  }
}

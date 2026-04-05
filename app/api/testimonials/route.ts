import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true,
        isFeatured: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 9,
    });

    const formattedTestimonials = testimonials.map((t) => ({
      text: t.text,
      name: t.user.name || "Devotee",
      role: "Muthappan Devotee",
      rating: t.rating,
    }));

    return NextResponse.json(formattedTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  // Logic for users to submit testimonials will go here or in a separate dedicated route
  return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
}

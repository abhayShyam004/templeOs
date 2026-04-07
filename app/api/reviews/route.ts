import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureReviewTargetExists } from "@/lib/reviews";
import { type ReviewTargetType as ReviewTargetTypeValue, isReviewTargetType } from "@/lib/review-target-type";

type ReviewRequestBody = {
  targetType?: ReviewTargetTypeValue;
  targetId?: string;
  rating?: number;
  title?: string;
  comment?: string;
};

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = (await request.json()) as ReviewRequestBody;

    if (!isReviewTargetType(body.targetType)) {
      return new NextResponse("Invalid review target type", { status: 400 });
    }

    if (!body.targetId || typeof body.targetId !== "string") {
      return new NextResponse("Invalid review target", { status: 400 });
    }

    const rating = Number(body.rating);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return new NextResponse("Rating must be between 1 and 5", { status: 400 });
    }

    const target = await ensureReviewTargetExists(body.targetType, body.targetId);
    if (!target) {
      return new NextResponse("Review target not found", { status: 404 });
    }

    const title = body.title?.trim() || null;
    const comment = body.comment?.trim() || null;

    const review = await db.review.upsert({
      where: {
        userId_targetType_targetId: {
          userId: session.user.id,
          targetType: body.targetType,
          targetId: body.targetId,
        },
      },
      update: {
        rating,
        title,
        comment,
      },
      create: {
        userId: session.user.id,
        targetType: body.targetType,
        targetId: body.targetId,
        rating,
        title,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Failed to save review", error);
    return new NextResponse("Failed to save review", { status: 500 });
  }
}

import { db } from "@/lib/db";
import { getOfferingDelegate } from "@/lib/offering-delegate";
import { ReviewTargetType } from "@/lib/review-target-type";

export type ReviewSummary = {
  averageRating: number | null;
  reviewCount: number;
};

export type ReviewWithAuthor = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
  };
};

export function getReviewTargetTypeFromCategory(category: string) {
  switch (category) {
    case "poojas":
      return ReviewTargetType.POOJA;
    case "prasadam":
      return ReviewTargetType.PRASADAM;
    case "goodies":
      return ReviewTargetType.GOODIE;
    case "offerings":
      return ReviewTargetType.OFFERING;
    default:
      throw new Error(`Unsupported review target category: ${category}`);
  }
}

export async function getReviewSummaries(targetType: ReviewTargetType, targetIds: string[]) {
  if (targetIds.length === 0) {
    return new Map<string, ReviewSummary>();
  }

  const groups = await db.review.groupBy({
    by: ["targetId"],
    where: {
      targetType,
      targetId: { in: targetIds },
    },
    _avg: {
      rating: true,
    },
    _count: {
      _all: true,
    },
  });

  return new Map(
    groups.map((group) => [
      group.targetId,
      {
        averageRating:
          typeof group._avg.rating === "number"
            ? Number(group._avg.rating.toFixed(1))
            : null,
        reviewCount: group._count._all,
      } satisfies ReviewSummary,
    ]),
  );
}

export async function getReviewSummary(targetType: ReviewTargetType, targetId: string): Promise<ReviewSummary> {
  const summaries = await getReviewSummaries(targetType, [targetId]);
  return summaries.get(targetId) ?? { averageRating: null, reviewCount: 0 };
}

export async function getReviewsForTarget(targetType: ReviewTargetType, targetId: string): Promise<ReviewWithAuthor[]> {
  return db.review.findMany({
    where: {
      targetType,
      targetId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function ensureReviewTargetExists(targetType: ReviewTargetType, targetId: string) {
  switch (targetType) {
    case ReviewTargetType.POOJA:
      return db.pooja.findUnique({ where: { id: targetId }, select: { id: true } });
    case ReviewTargetType.PRASADAM:
      return db.prasadItem.findUnique({ where: { id: targetId }, select: { id: true } });
    case ReviewTargetType.GOODIE:
      return db.goodieItem.findUnique({ where: { id: targetId }, select: { id: true } });
    case ReviewTargetType.OFFERING: {
      const offeringItem = getOfferingDelegate();
      return offeringItem.findUnique({ where: { id: targetId }, select: { id: true } });
    }
    default:
      return null;
  }
}

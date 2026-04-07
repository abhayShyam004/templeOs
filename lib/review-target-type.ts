export const ReviewTargetType = {
  POOJA: "POOJA",
  PRASADAM: "PRASADAM",
  GOODIE: "GOODIE",
  OFFERING: "OFFERING",
} as const;

export type ReviewTargetType = (typeof ReviewTargetType)[keyof typeof ReviewTargetType];

export function isReviewTargetType(value: unknown): value is ReviewTargetType {
  return typeof value === "string" && Object.values(ReviewTargetType).includes(value as ReviewTargetType);
}

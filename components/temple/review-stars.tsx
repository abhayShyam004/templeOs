import { cn } from "@/lib/utils";

type ReviewStarsProps = {
  rating: number;
  className?: string;
  sizeClassName?: string;
};

export function ReviewStars({ rating, className, sizeClassName = "text-base" }: ReviewStarsProps) {
  const filledStars = Math.round(rating);

  return (
    <div
      className={cn("flex items-center gap-1 text-amber-500", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={cn(sizeClassName, index < filledStars ? "opacity-100" : "opacity-25")}
        >
          ★
        </span>
      ))}
    </div>
  );
}

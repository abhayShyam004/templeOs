"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { type ReviewTargetType } from "@/lib/review-target-type";

type ReviewFormProps = {
  targetId: string;
  targetType: ReviewTargetType;
  initialReview?: {
    rating: number;
    title: string | null;
    comment: string | null;
  } | null;
};

export function ReviewForm({ targetId, targetType, initialReview }: ReviewFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [rating, setRating] = useState(initialReview?.rating ?? 5);
  const [title, setTitle] = useState(initialReview?.title ?? "");
  const [comment, setComment] = useState(initialReview?.comment ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-[#ddc7c2] bg-white p-5">
        <p className="text-sm text-[#6b5450]">Login to leave a rating and review for this item.</p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`}
          className="mt-4 inline-flex rounded-xl bg-[#211a1a] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black"
        >
          Login to Rate
        </Link>
      </div>
    );
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetId,
          targetType,
          rating,
          title,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to save rating");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-[1.75rem] border border-[#efd8d4] bg-white p-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c1493f]">Your Rating</p>
        <p className="mt-2 text-sm text-[#6b5450]">You can submit one rating per item and update it anytime.</p>
      </div>

      <div className="mt-5 flex gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`text-3xl transition ${value <= rating ? "text-amber-500" : "text-[#d8c2c0]"}`}
              aria-label={`Rate ${value} stars`}
            >
              ★
            </button>
          );
        })}
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d706a]">Headline</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-2xl border border-[#efd8d4] bg-[#fffaf8] px-4 py-3 text-sm outline-none transition focus:border-[#ff766c]"
          placeholder="Short summary of your experience"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#8d706a]">Review</span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="min-h-32 w-full rounded-2xl border border-[#efd8d4] bg-[#fffaf8] px-4 py-3 text-sm outline-none transition focus:border-[#ff766c]"
          placeholder="Share what stood out, the product quality, the experience, or anything future visitors should know."
        />
      </label>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-5 inline-flex rounded-xl bg-[#ff766c] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : initialReview ? "Update Rating" : "Submit Rating"}
      </button>
    </form>
  );
}

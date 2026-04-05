import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

let fallbackClient: PrismaClient | null = null;

export function getOfferingDelegate() {
  const primary = (db as any).offeringItem;
  if (primary && typeof primary.findMany === "function") {
    return primary;
  }

  if (!fallbackClient) {
    fallbackClient = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  const fallback = (fallbackClient as any).offeringItem;
  if (!fallback || typeof fallback.findMany !== "function") {
    throw new Error("OfferingItem delegate unavailable on Prisma client.");
  }

  return fallback;
}

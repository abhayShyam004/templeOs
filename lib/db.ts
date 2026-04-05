import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

const cached = global.prisma;
const hasOfferingDelegate = cached ? "offeringItem" in cached : false;

export const db = cached && hasOfferingDelegate ? cached : createClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}

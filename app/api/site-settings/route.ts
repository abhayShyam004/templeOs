import { NextResponse } from "next/server";
import { ensureDefaultSiteSettings, getSiteSettingsMap } from "@/lib/temple-data";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDefaultSiteSettings();
  const settings = await getSiteSettingsMap();
  return NextResponse.json(settings);
}

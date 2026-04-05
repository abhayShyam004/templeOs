import { NextResponse } from "next/server";
import { ensureDefaultSiteSettings, getSiteSettingsMap } from "@/lib/temple-data";

export async function GET() {
  await ensureDefaultSiteSettings();
  const settings = await getSiteSettingsMap();
  return NextResponse.json(settings);
}

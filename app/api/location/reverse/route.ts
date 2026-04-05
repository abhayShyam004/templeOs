import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ReverseGeocodeResponse = {
  display_name?: string;
  address?: Record<string, string | undefined>;
};

function pickLocationLabel(address: Record<string, string | undefined>) {
  const candidates = [
    address.suburb,
    address.neighbourhood,
    address.quarter,
    address.hamlet,
    address.village,
    address.city_district,
    address.town,
    address.city,
    address.county,
    address.state_district,
    address.state,
  ];

  return candidates.find(Boolean)?.trim() || "Current location";
}

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("lat"));
  const longitude = Number(request.nextUrl.searchParams.get("lon"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return new NextResponse("Valid latitude and longitude are required.", { status: 400 });
  }

  try {
    const reverseLookupUrl = new URL("https://nominatim.openstreetmap.org/reverse");
    reverseLookupUrl.searchParams.set("format", "jsonv2");
    reverseLookupUrl.searchParams.set("lat", String(latitude));
    reverseLookupUrl.searchParams.set("lon", String(longitude));
    reverseLookupUrl.searchParams.set("zoom", "16");
    reverseLookupUrl.searchParams.set("addressdetails", "1");

    const response = await fetch(reverseLookupUrl, {
      headers: {
        "Accept-Language": "en-IN,en;q=0.9",
        "User-Agent": "TempleOS Delivery Location/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse("Unable to resolve your current location.", { status: 502 });
    }

    const payload = (await response.json()) as ReverseGeocodeResponse;
    const address = payload.address ?? {};

    return NextResponse.json({
      label: pickLocationLabel(address),
      address: payload.display_name ?? "",
      pincode: address.postcode ?? "",
      latitude,
      longitude,
    });
  } catch (error) {
    console.error("Reverse geocoding failed", error);
    return new NextResponse("Unable to resolve your current location.", { status: 500 });
  }
}

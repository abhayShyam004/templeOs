"use client";

import { useCallback, useEffect, useState } from "react";

export type DeliveryLocation = {
  label: string;
  address: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  source: "browser" | "manual";
  updatedAt: number;
};

const DELIVERY_LOCATION_STORAGE_KEY = "temple-delivery-location";
const DELIVERY_LOCATION_EVENT = "delivery-location-updated";

function parseStoredDeliveryLocation(value: string | null): DeliveryLocation | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<DeliveryLocation>;
    if (!parsed || typeof parsed.label !== "string") {
      return null;
    }

    return {
      label: parsed.label.trim(),
      address: typeof parsed.address === "string" ? parsed.address.trim() : "",
      pincode: typeof parsed.pincode === "string" ? parsed.pincode.trim() : "",
      latitude: typeof parsed.latitude === "number" ? parsed.latitude : undefined,
      longitude: typeof parsed.longitude === "number" ? parsed.longitude : undefined,
      source: parsed.source === "browser" ? "browser" : "manual",
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function getStoredDeliveryLocation(): DeliveryLocation | null {
  if (typeof window === "undefined") return null;
  return parseStoredDeliveryLocation(window.localStorage.getItem(DELIVERY_LOCATION_STORAGE_KEY));
}

export function saveDeliveryLocation(location: DeliveryLocation | null) {
  if (typeof window === "undefined") return;

  if (location) {
    window.localStorage.setItem(DELIVERY_LOCATION_STORAGE_KEY, JSON.stringify(location));
  } else {
    window.localStorage.removeItem(DELIVERY_LOCATION_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(DELIVERY_LOCATION_EVENT));
}

export function inferDeliveryLocationLabel(address: string, fallbackPincode?: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return parts[parts.length - 2];
  }

  if (parts.length === 1) {
    return parts[0];
  }

  if (fallbackPincode?.trim()) {
    return `Pincode ${fallbackPincode.trim()}`;
  }

  return "Selected location";
}

export function createManualDeliveryLocation(input: {
  label?: string;
  address: string;
  pincode?: string;
}): DeliveryLocation {
  const address = input.address.trim();
  const pincode = input.pincode?.trim() ?? "";
  const label = input.label?.trim() || inferDeliveryLocationLabel(address, pincode);

  return {
    label,
    address,
    pincode,
    source: "manual",
    updatedAt: Date.now(),
  };
}

function getGeolocationErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    const code = (error as GeolocationPositionError).code;
    if (code === 1) return "Location permission was denied. Enter your address manually instead.";
    if (code === 2) return "The browser could not determine your location.";
    if (code === 3) return "Location lookup timed out. Try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unable to determine your current location.";
}

export async function requestBrowserDeliveryLocation(): Promise<DeliveryLocation> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported in this browser.");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  }).catch((error) => {
    throw new Error(getGeolocationErrorMessage(error));
  });

  const params = new URLSearchParams({
    lat: String(position.coords.latitude),
    lon: String(position.coords.longitude),
  });

  const response = await fetch(`/api/location/reverse?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to resolve your current location.");
  }

  const payload = (await response.json()) as {
    label?: string;
    address?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  };

  return {
    label: payload.label?.trim() || "Current location",
    address: payload.address?.trim() || "",
    pincode: payload.pincode?.trim() || "",
    latitude: payload.latitude,
    longitude: payload.longitude,
    source: "browser",
    updatedAt: Date.now(),
  };
}

export function useDeliveryLocation() {
  const [location, setLocation] = useState<DeliveryLocation | null>(null);

  useEffect(() => {
    const syncLocation = () => {
      setLocation(getStoredDeliveryLocation());
    };

    syncLocation();
    window.addEventListener(DELIVERY_LOCATION_EVENT, syncLocation);
    window.addEventListener("storage", syncLocation);

    return () => {
      window.removeEventListener(DELIVERY_LOCATION_EVENT, syncLocation);
      window.removeEventListener("storage", syncLocation);
    };
  }, []);

  const persistLocation = useCallback((nextLocation: DeliveryLocation | null) => {
    saveDeliveryLocation(nextLocation);
    setLocation(nextLocation);
  }, []);

  return {
    location,
    saveLocation: persistLocation,
    clearLocation: () => persistLocation(null),
  };
}

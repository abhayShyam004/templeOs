"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  createManualDeliveryLocation,
  requestBrowserDeliveryLocation,
  useDeliveryLocation,
} from "@/lib/delivery-location";

export function DeliveryLocationControl() {
  const { location, saveLocation, clearLocation } = useDeliveryLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setLabel(location?.label ?? "");
    setAddress(location?.address ?? "");
    setPincode(location?.pincode ?? "");
    setError("");
  }, [isOpen, location]);

  const handleUseCurrentLocation = async () => {
    setIsDetecting(true);
    setError("");

    try {
      const nextLocation = await requestBrowserDeliveryLocation();
      saveLocation(nextLocation);
      setIsOpen(false);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to determine your current location.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!address.trim()) {
      setError("Enter your delivery address.");
      return;
    }

    saveLocation(
      createManualDeliveryLocation({
        label,
        address,
        pincode,
      }),
    );
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden max-w-[12rem] min-w-0 lg:flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border-l border-outline-variant pl-6 ml-2"
      >
        <span className="material-symbols-outlined text-sm">location_on</span>
        <div className="flex min-w-0 flex-col items-start">
          <span className="text-[10px] leading-none uppercase tracking-wider opacity-60">Deliver to</span>
          <span className="max-w-[150px] truncate text-xs font-bold leading-none">
            {location?.label || "Set location"}
          </span>
        </div>
      </button>

      {isMounted &&
        isOpen &&
        createPortal(
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-3 pb-6 pt-24 sm:px-4 sm:pb-8 sm:pt-28">
          <button
            type="button"
            aria-label="Close delivery location dialog"
            className="absolute inset-0 z-[201] bg-black/45 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-[202] w-full max-w-lg overflow-y-auto rounded-3xl border border-outline-variant bg-surface p-5 shadow-2xl max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8rem)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.24em] text-on-surface-variant">Delivery Location</p>
                <h2 className="mt-2 text-2xl font-headline font-black text-on-surface">Use the real customer location</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Choose browser location or save the delivery address manually.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-outline-variant bg-surface-container/40 p-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Current selection</p>
                  <p className="mt-2 break-words text-lg font-bold text-on-surface">{location?.label || "No location saved"}</p>
                  {location?.address && (
                    <p className="mt-1 break-words text-sm text-on-surface-variant">{location.address}</p>
                  )}
                </div>

                {location && (
                  <button
                    type="button"
                    onClick={() => clearLocation()}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant hover:text-on-surface"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetecting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition hover:brightness-110 disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-base">my_location</span>
              {isDetecting ? "Detecting your location..." : "Use current browser location"}
            </button>

            <form className="mt-6 space-y-4" onSubmit={handleManualSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Area / locality
                  </span>
                  <input
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                    placeholder="Indicate area or city"
                    className="w-full rounded-2xl border border-outline-variant bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                    Pincode
                  </span>
                  <input
                    value={pincode}
                    onChange={(event) => setPincode(event.target.value)}
                    placeholder="Postal code"
                    className="w-full rounded-2xl border border-outline-variant bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Delivery address
                </span>
                <textarea
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  rows={4}
                  placeholder="House number, street, landmark, area, city"
                  className="w-full resize-none rounded-2xl border border-outline-variant bg-surface-container-high px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-2xl border border-outline-variant bg-surface px-4 py-3 text-sm font-bold text-on-surface transition hover:bg-surface-container-high"
              >
                Save delivery location
              </button>
            </form>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type PolicyModalProps = {
  activePolicy: "privacy" | "terms" | null;
  onClose: () => void;
};

export function PolicyModal({ activePolicy, onClose }: PolicyModalProps) {
  useEffect(() => {
    if (activePolicy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activePolicy]);

  if (!activePolicy) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1a1313] p-5 text-[#fef1f0] shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold">{activePolicy === "privacy" ? "Privacy Policy" : "Terms & Conditions"}</h3>
          <button
            aria-label="Close policy modal"
            className="rounded-md border border-white/15 p-1.5 text-[#fef1f0] transition hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        {activePolicy === "privacy" ? (
          <div className="space-y-3 text-sm leading-relaxed text-[#d9cfcf]">
            <p>
              We collect only the information required to provide temple services such as pooja bookings, prasadam orders, and
              customer support.
            </p>
            <p>Collected information can include your name, phone number, email, address, order details, and booking history.</p>
            <p>Your data is used only for service fulfillment, communication, and record keeping. We do not sell personal data.</p>
            <p>
              Payment processing is handled through trusted payment partners, and this website does not store sensitive payment
              credentials.
            </p>
            <p>
              For updates or deletion requests, contact us at{" "}
              <a className="text-[#ffb0a9] hover:text-[#ffd3cf]" href="mailto:shyamsalila@gmail.com">
                shyamsalila@gmail.com
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-sm leading-relaxed text-[#d9cfcf]">
            <p>Bookings are confirmed only after successful payment and final verification by the temple administration.</p>
            <p>
              Pooja schedules, event timings, and service availability may change due to festival schedules, rituals, or
              operational requirements.
            </p>
            <p>Users are responsible for submitting accurate contact and delivery details for all bookings and prasadam orders.</p>
            <p>The temple may cancel or reject bookings that are incomplete, invalid, duplicate, or against temple rules.</p>
            <p>By using this website, you agree to these terms and any future updates published by the temple.</p>
          </div>
        )}
      </div>
    </div>
  );
}

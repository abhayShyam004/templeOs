"use client";

import { useState, useEffect } from "react";
import { FileText, Mail, MapPin, MessageCircle, ShieldCheck, X } from "lucide-react";

export function PublicFooter() {
  const [activePolicyModal, setActivePolicyModal] = useState<"privacy" | "terms" | null>(null);

  useEffect(() => {
    if (activePolicyModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activePolicyModal]);

  return (
    <>
      <footer className="flex w-full flex-col items-start justify-between gap-8 bg-[#181212] px-4 py-10 sm:px-6 md:flex-row md:items-center md:px-12">
        <div className="flex flex-col items-start">
          <div className="mb-2 text-lg font-bold text-[#ff8e84]">ശ്രീ Muthappa Madapura</div>
          <p className="text-left text-sm tracking-wide text-[#b4a8a8]">
            © 2026 ശ്രീ muthappa madapura Indiranagar. All Rights Reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm tracking-wide sm:gap-6">
          <button
            className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]"
            onClick={() => setActivePolicyModal("privacy")}
            type="button"
          >
            <ShieldCheck size={14} />
            Privacy
          </button>
          <button
            className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]"
            onClick={() => setActivePolicyModal("terms")}
            type="button"
          >
            <FileText size={14} />
            Terms
          </button>
          <a
            className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]"
            href="https://maps.google.com/?q=Muthappa+Madapura+Indiranagar+Hyderabad"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MapPin size={14} />
            Temple Map
          </a>
          <a className="inline-flex items-center gap-2 text-[#b4a8a8] transition-colors hover:text-[#fef1f0]" href="mailto:shyamsalila@gmail.com">
            <Mail size={14} />
            Contact
          </a>
        </div>

        <div className="flex gap-4">
          <a
            aria-label="Chat on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4e4646] text-[#b4a8a8] transition-all hover:border-[#ff8e84] hover:text-[#ff8e84]"
            href="https://wa.me/917989191136"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle size={18} />
          </a>
          <a
            aria-label="Send email"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4e4646] text-[#b4a8a8] transition-all hover:border-[#ff8e84] hover:text-[#ff8e84]"
            href="mailto:shyamsalila@gmail.com"
          >
            <Mail size={18} />
          </a>
        </div>
      </footer>

      {activePolicyModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setActivePolicyModal(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#1a1313] p-5 text-[#fef1f0] shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">{activePolicyModal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}</h3>
              <button
                aria-label="Close policy modal"
                className="rounded-md border border-white/15 p-1.5 text-[#fef1f0] transition hover:bg-white/10"
                onClick={() => setActivePolicyModal(null)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            {activePolicyModal === "privacy" ? (
              <div className="space-y-3 text-sm leading-relaxed text-[#d9cfcf]">
                <p>
                  We collect only the information required to provide temple services such as pooja bookings, prasadam orders, and
                  customer support.
                </p>
                <p>Collected information can include your name, phone number, email, address, order details, and booking history.</p>
                <p>
                  Your data is used only for service fulfillment, communication, and record keeping. We do not sell personal data.
                </p>
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
                <p>
                  Users are responsible for submitting accurate contact and delivery details for all bookings and prasadam orders.
                </p>
                <p>
                  The temple may cancel or reject bookings that are incomplete, invalid, duplicate, or against temple rules.
                </p>
                <p>By using this website, you agree to these terms and any future updates published by the temple.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

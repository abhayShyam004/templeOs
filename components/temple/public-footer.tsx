"use client";

import { useState } from "react";
import { FileText, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { PolicyModal } from "@/components/temple/policy-modal";

export function PublicFooter() {
  const [activePolicyModal, setActivePolicyModal] = useState<"privacy" | "terms" | null>(null);

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

      <PolicyModal activePolicy={activePolicyModal} onClose={() => setActivePolicyModal(null)} />
    </>
  );
}

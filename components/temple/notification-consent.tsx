"use client";

import { useEffect, useState } from "react";

export function NotificationConsent({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const local = window.localStorage.getItem("temple_notification_choice");
    if (!local) {
      setOpen(true);
      return;
    }

    setSaved(true);
  }, []);

  const saveChoice = async (allowEmails: boolean) => {
    window.localStorage.setItem("temple_notification_choice", allowEmails ? "allow" : "deny");

    try {
      await fetch("/api/notification-preference", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allowEmails }),
      });
    } catch {
      // For signed-out users this call is expected to fail; local preference is still captured.
    }

    setSaved(true);
    setOpen(false);
  };

  if (!open && !saved) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm">
      {open ? (
        <div className="rounded-2xl border border-border bg-white/95 p-5 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Temple Updates</p>
          <h3 className="mt-2 font-serif text-2xl">{title}</h3>
          <p className="mt-2 text-sm text-muted">{description}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => saveChoice(true)}
              className="flex-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              Allow
            </button>
            <button
              type="button"
              onClick={() => saveChoice(false)}
              className="flex-1 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              No Thanks
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-full border border-border bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted shadow">
          Email alerts preference saved
        </div>
      )}
    </div>
  );
}

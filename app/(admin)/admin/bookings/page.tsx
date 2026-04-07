import { CalendarDays, CreditCard, Mail, Package, Sparkles, User2 } from "lucide-react";
import { db as prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      pooja: { select: { name: true, price: true, duration: true } },
    },
  });

  return (
    <div className="flex flex-col">
      <section className="mb-8 md:mb-12">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-on-surface md:text-5xl">Ritual Ledger</h1>
        <p className="max-w-3xl text-base font-medium text-on-surface-variant md:text-lg">
          Booking operations view with devotee details, account identity, prasadam delivery decision, and payment traceability.
        </p>
      </section>

      <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-outline-variant bg-surface p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">Bookings</p>
          <h2 className="mt-2 text-2xl font-bold text-on-surface">Recent Booking Records</h2>
        </div>
        <span className="rounded-full border border-outline-variant bg-surface-container px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          {bookings.length} Total
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-outline-variant bg-surface-container-low px-8 py-20 text-center text-on-surface-variant">
          <Sparkles className="mx-auto h-12 w-12 opacity-30" />
          <p className="mt-4">No bookings recorded in the ledger yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-3xl border border-outline-variant bg-surface p-6 shadow-sm transition hover:shadow-md md:p-7"
            >
              <div className="flex flex-col gap-4 border-b border-outline-variant pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">Booking Token</p>
                  <p className="mt-2 font-mono text-xs font-bold text-on-surface">{booking.id.toUpperCase()}</p>
                  <h3 className="mt-4 text-2xl font-bold font-headline text-on-surface">{booking.pooja.name}</h3>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Badge tone={booking.paymentStatus === "PAID" ? "success" : "warning"}>{booking.paymentStatus}</Badge>
                  <Badge tone="neutral">{booking.status}</Badge>
                </div>
              </div>

              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <DetailBlock
                  icon={<User2 size={16} />}
                  label="Devotee"
                  lines={[
                    booking.devoteeName,
                    `Nakshatra: ${booking.nakshatra}`,
                    `Gotra: ${booking.gotra || "Not specified"}`,
                  ]}
                />

                <DetailBlock
                  icon={<Mail size={16} />}
                  label="Account"
                  lines={[
                    booking.user.name || "Anonymous account",
                    booking.user.email,
                    `User ID: ${booking.user.id}`,
                  ]}
                />

                <DetailBlock
                  icon={<CalendarDays size={16} />}
                  label="Schedule"
                  lines={[
                    new Intl.DateTimeFormat("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(booking.scheduledDate),
                    `Booked on ${new Intl.DateTimeFormat("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(booking.createdAt)}`,
                    `Duration: ${booking.pooja.duration}`,
                  ]}
                />

                <DetailBlock
                  icon={<Package size={16} />}
                  label="Prasadam"
                  lines={[
                    booking.prasadRequested ? "Home delivery requested" : "Temple collection only",
                    `Contribution: ${formatCurrency(booking.pooja.price)}`,
                  ]}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
                <div className="flex items-start gap-3">
                  <CreditCard size={16} className="mt-1 text-primary" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Payment Trace</p>
                    <p className="mt-2 break-all text-sm font-medium text-on-surface">
                      {booking.paymentId || "No payment ID recorded"}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailBlock({
  icon,
  label,
  lines,
}: {
  icon: React.ReactNode;
  label: string;
  lines: string[];
}) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
      </div>
      <div className="mt-3 space-y-2">
        {lines.map((line) => (
          <p key={line} className="break-words text-sm text-on-surface">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success" | "warning" | "neutral";
}) {
  const toneClass =
    tone === "success"
      ? "bg-success/10 text-success border-success/20"
      : tone === "warning"
        ? "bg-warning/10 text-on-tertiary border-warning/20"
        : "bg-surface-container text-on-surface-variant border-outline-variant";

  return (
    <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${toneClass}`}>
      {children}
    </span>
  );
}

export default function AdminCertificatesPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Title Section */}
      <section>
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2">
          Certificate Vault
        </h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-3xl">
          Generate, preview, upload, and resend devotional certificates for completed Pooja bookings.
        </p>
      </section>

      {/* Placeholder for Operations */}
      <div className="bg-surface p-12 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center shadow-sm">
        <span className="material-symbols-outlined text-6xl text-primary mb-4 opacity-20">
          workspace_premium
        </span>
        <h3 className="text-xl font-bold text-on-surface mb-2">Operational Workflow Pending</h3>
        <p className="text-on-surface-variant max-w-md mb-8">
          The certificate distribution system is currently being integrated with the payment verification pipeline.
        </p>
        <div className="bg-surface-container-low px-6 py-4 rounded-lg border border-outline-variant font-mono text-xs text-on-surface-variant">
          Endpoint: <span className="text-primary">POST /api/certificates/[bookingId]</span>
        </div>
      </div>
    </div>
  );
}

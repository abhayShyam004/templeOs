export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-12 animate-pulse">
      <header className="space-y-4">
        <div className="h-3 w-32 bg-surface-container rounded-full" />
        <div className="h-12 w-64 bg-surface-container rounded-xl" />
        <div className="h-4 w-96 bg-surface-container rounded-full" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[240px] bg-surface rounded-3xl border border-outline-variant" />
        <div className="h-[240px] bg-surface rounded-3xl border border-outline-variant" />
      </div>

      <div className="h-64 bg-surface-container-low rounded-3xl border border-outline-variant" />
    </div>
  );
}

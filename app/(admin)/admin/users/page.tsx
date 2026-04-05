import { db as prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Title Section */}
      <section>
        <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-2">
          Devotee Registry
        </h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
          Authenticated user directory with role assignments and registration lifecycle metadata.
        </p>
      </section>

      {/* Table Section */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            Community Members
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
            {users.length} Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Devotee</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Email Address</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Role</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                        {u.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <span className="font-bold text-on-surface">{u.name || "Anonymous Devotee"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                    {u.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      u.role === "ADMIN" 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-outline-variant/10 text-on-surface-variant border border-outline-variant/20"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

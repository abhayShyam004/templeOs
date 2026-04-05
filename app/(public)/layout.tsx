import type { ReactNode } from "react"
import { PublicLayoutShell } from "@/components/temple/public-layout-shell"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>
}

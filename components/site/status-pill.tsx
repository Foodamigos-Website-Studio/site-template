import type { OpenStatus } from "@/lib/open-status"
import { cn } from "@/lib/utils"

export function StatusPill({ status, className }: { status: OpenStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-secondary px-3 py-1.5 text-xs font-bold",
        status.open ? "bg-secondary text-background" : "bg-transparent text-secondary",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-2 rounded-full", status.open ? "bg-primary" : "bg-secondary/60")} />
      {status.label}
    </span>
  )
}

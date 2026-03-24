import { statusColors } from "@/lib/formatters"

const statusIcons: Record<string, string> = {
  DETECTED: "\u25CB",
  BUILDING: "\u25D4",
  REVIEW: "\u25D0",
  ROLLING_OUT: "\u25D1",
  COMPLETED: "\u25CF",
  HALTED: "\u2716",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[status] ?? ""}`}>
      <span className="text-[8px]">{statusIcons[status] ?? "\u25CF"}</span>
      {status.replace("_", " ")}
    </span>
  )
}

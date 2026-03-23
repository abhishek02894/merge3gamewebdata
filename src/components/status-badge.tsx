import { Badge } from "@/components/ui/badge"
import { statusColors } from "@/lib/formatters"

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={statusColors[status] ?? ""}>
      {status.replace("_", " ")}
    </Badge>
  )
}

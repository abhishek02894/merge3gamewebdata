import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime, formatPercentage } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"

type RolloutEntry = {
  id: string
  percentage: number
  status: string
  track: string
  fetchedAt: Date | string
  notes: string | null
}

export function RolloutHistory({ entries }: { entries: RolloutEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        No rollout data recorded
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Track</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="text-sm">
              {formatDateTime(entry.fetchedAt)}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {entry.track}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-sm">
              {formatPercentage(entry.percentage)}
            </TableCell>
            <TableCell className="text-sm">{entry.status}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {entry.notes ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

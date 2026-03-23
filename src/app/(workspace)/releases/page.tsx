import Link from "next/link"
import { getAllReleases } from "@/lib/data/releases"
import { StatusBadge } from "@/components/status-badge"
import { formatVersion, formatDate, formatPercentage } from "@/lib/formatters"
import type { ReleaseStatus } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "All Releases - Game Release Tracker",
}

export default async function AllReleasesPage({
  searchParams,
}: {
  searchParams: Promise<{ gameId?: string; status?: string; page?: string }>
}) {
  const sp = await searchParams
  const page = Number(sp.page ?? "1")

  const { releases, total, pages } = await getAllReleases({
    gameId: sp.gameId,
    status: sp.status as ReleaseStatus | undefined,
    page,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Releases</h1>
        <p className="text-sm text-muted-foreground">{total} total</p>
      </div>

      {releases.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No releases found
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Game</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rollout</TableHead>
              <TableHead>Commits</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases.map((release) => (
              <TableRow key={release.id}>
                <TableCell>
                  <Link
                    href={`/games/${release.game.id}`}
                    className="text-sm hover:underline"
                  >
                    {release.game.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/games/${release.game.id}/releases/${release.id}`}
                    className="font-medium hover:underline"
                  >
                    {formatVersion(release.versionName, release.versionCode)}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {release.tagName}
                </TableCell>
                <TableCell>
                  <StatusBadge status={release.status} />
                </TableCell>
                <TableCell className="text-sm">
                  {release.latestRollout
                    ? formatPercentage(release.latestRollout.percentage)
                    : "—"}
                </TableCell>
                <TableCell className="text-sm">{release.commitCount}</TableCell>
                <TableCell className="text-sm">
                  {formatDate(release.releaseDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/releases?page=${p}${sp.gameId ? `&gameId=${sp.gameId}` : ""}${sp.status ? `&status=${sp.status}` : ""}`}
              className={`rounded-md px-3 py-1 text-sm ${
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

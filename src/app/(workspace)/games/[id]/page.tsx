export const dynamic = "force-dynamic"

import Link from "next/link"
import { notFound } from "next/navigation"
import { getGameById } from "@/lib/data/games"
import { getReleasesByGame } from "@/lib/data/releases"
import { StatusBadge } from "@/components/status-badge"
import { formatVersion, formatDate, formatPercentage } from "@/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Gamepad2, GitBranch, ExternalLink } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const game = await getGameById(id)
  return { title: game ? `${game.name} - Game Release Tracker` : "Not Found" }
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const game = await getGameById(id)

  if (!game) notFound()

  const { releases } = await getReleasesByGame(id)

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Gamepad2 className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{game.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">
            {game.packageName}
          </p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="size-4" />
              GitLab
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={game.gitlabRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {game.gitlabRepoUrl}
              <ExternalLink className="size-3" />
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {game._count.releases} total release
              {game._count.releases !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Releases Table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Releases</h2>
        {releases.length === 0 ? (
          <p className="text-sm text-muted-foreground">No releases yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
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
                      href={`/games/${id}/releases/${release.id}`}
                      className="font-medium hover:underline"
                    >
                      {formatVersion(
                        release.versionName,
                        release.versionCode
                      )}
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
                  <TableCell className="text-sm">
                    {release.commitCount}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(release.releaseDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

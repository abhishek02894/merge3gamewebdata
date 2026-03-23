import Link from "next/link"
import { getGamesWithLatestRelease } from "@/lib/data/games"
import { StatusBadge } from "@/components/status-badge"
import { formatVersion, formatDate } from "@/lib/formatters"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Gamepad2 } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Games - Game Release Tracker",
}

export default async function GamesPage() {
  const games = await getGamesWithLatestRelease()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Games</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Game</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Latest Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Release</TableHead>
            <TableHead className="text-right">Releases</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell>
                <Link
                  href={`/games/${game.id}`}
                  className="flex items-center gap-2 font-medium hover:underline"
                >
                  <Gamepad2 className="size-4 text-muted-foreground" />
                  {game.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground font-mono">
                {game.packageName}
              </TableCell>
              <TableCell className="text-sm">
                {game.latestRelease
                  ? formatVersion(
                      game.latestRelease.versionName,
                      game.latestRelease.versionCode
                    )
                  : "—"}
              </TableCell>
              <TableCell>
                {game.latestRelease ? (
                  <StatusBadge status={game.latestRelease.status} />
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell className="text-sm">
                {game.latestRelease
                  ? formatDate(game.latestRelease.releaseDate)
                  : "—"}
              </TableCell>
              <TableCell className="text-right text-sm">
                {game.releaseCount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

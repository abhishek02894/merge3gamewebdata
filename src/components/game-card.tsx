import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/status-badge"
import { formatVersion, formatRelativeDate } from "@/lib/formatters"
import type { GameWithLatestRelease } from "@/lib/types"
import { Gamepad2, Tag } from "lucide-react"

export function GameCard({ game }: { game: GameWithLatestRelease }) {
  const release = game.latestRelease
  const rolloutPct = release?.rolloutPercentage ?? 0

  return (
    <Link href={`/games/${game.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Gamepad2 className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{game.name}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">
              {game.packageName}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {release ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm">
                  <Tag className="size-3.5" />
                  <span className="font-medium">
                    {formatVersion(release.versionName, release.versionCode)}
                  </span>
                </div>
                <StatusBadge status={release.status} />
              </div>
              {release.status === "ROLLING_OUT" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Rollout</span>
                    <span>{rolloutPct.toFixed(0)}%</span>
                  </div>
                  <Progress value={rolloutPct} className="h-1.5" />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {formatRelativeDate(release.releaseDate)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No releases yet</p>
          )}
          <div className="text-xs text-muted-foreground">
            {game.releaseCount} total release{game.releaseCount !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

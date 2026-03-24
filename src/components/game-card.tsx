import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/status-badge"
import { formatVersion, formatRelativeDate } from "@/lib/formatters"
import type { GameWithLatestRelease } from "@/lib/types"
import { Gamepad2, Tag, ChevronRight, Clock } from "lucide-react"

const gameColors = [
  { bg: "bg-violet-500/15", text: "text-violet-600", accent: "from-violet-500/8" },
  { bg: "bg-sky-500/15", text: "text-sky-600", accent: "from-sky-500/8" },
  { bg: "bg-amber-500/15", text: "text-amber-600", accent: "from-amber-500/8" },
]

export function GameCard({ game, index = 0 }: { game: GameWithLatestRelease; index?: number }) {
  const release = game.latestRelease
  const rolloutPct = release?.rolloutPercentage ?? 0
  const color = gameColors[index % gameColors.length]

  return (
    <Link href={`/games/${game.id}`} className="group">
      <Card className="relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <div className={`absolute inset-0 bg-gradient-to-br ${color.accent} via-transparent to-transparent`} />
        <CardHeader className="relative flex flex-row items-center gap-3 pb-2">
          <div className={`flex size-11 items-center justify-center rounded-2xl ${color.bg} transition-transform duration-300 group-hover:scale-110`}>
            <Gamepad2 className={`size-5 ${color.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-bold truncate">{game.name}</CardTitle>
            <p className="text-[11px] text-muted-foreground/70 truncate font-mono">
              {game.packageName}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground/30 transition-all group-hover:text-muted-foreground group-hover:translate-x-0.5" />
        </CardHeader>
        <CardContent className="relative space-y-3">
          {release ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm">
                  <Tag className="size-3.5 text-muted-foreground" />
                  <span className="font-semibold">
                    {formatVersion(release.versionName, release.versionCode)}
                  </span>
                </div>
                <StatusBadge status={release.status} />
              </div>
              {release.status === "ROLLING_OUT" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="font-medium">Rollout</span>
                    <span className="font-bold">{rolloutPct.toFixed(0)}%</span>
                  </div>
                  <Progress value={rolloutPct} className="h-2" />
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                <Clock className="size-3" />
                {formatRelativeDate(release.releaseDate)}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-3">
              <p className="text-sm text-muted-foreground/60 font-medium">No releases yet</p>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-[11px] font-medium text-muted-foreground/60">
              {game.releaseCount} release{game.releaseCount !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

import { getGamesWithLatestRelease } from "@/lib/data/games"
import { getDashboardData } from "@/lib/data/releases"
import { GameCard } from "@/components/game-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRelativeDate } from "@/lib/formatters"
import { Activity, Tag, TrendingUp, Zap, ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard - Game Release Tracker",
}

export default async function DashboardPage() {
  const [games, dashboardData] = await Promise.all([
    getGamesWithLatestRelease(),
    getDashboardData(),
  ])

  const { stats, recentActivity } = dashboardData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of all your game releases and rollouts</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative overflow-hidden border-0 shadow-md shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent" />
          <CardContent className="relative flex items-center gap-4 pt-6 pb-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-500/15">
              <Tag className="size-6 text-violet-600" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats.totalReleases}</p>
              <p className="text-xs font-medium text-muted-foreground">Total Releases</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-md shadow-orange-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
          <CardContent className="relative flex items-center gap-4 pt-6 pb-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/15">
              <TrendingUp className="size-6 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats.activeRollouts}</p>
              <p className="text-xs font-medium text-muted-foreground">Active Rollouts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-0 shadow-md shadow-emerald-500/5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
          <CardContent className="relative flex items-center gap-4 pt-6 pb-6">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15">
              <Zap className="size-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{stats.releasesThisMonth}</p>
              <p className="text-xs font-medium text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Your Games</h2>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{games.length} games</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-md shadow-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="size-3.5 text-primary" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                <Activity className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Push a tag or release to see activity here</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm py-2.5 px-3 rounded-xl transition-colors hover:bg-muted/50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full shrink-0 ${
                      item.type === "release" ? "bg-violet-500" : "bg-orange-500"
                    }`} />
                    <span className="font-medium">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatRelativeDate(item.date)}
                    </span>
                    <ArrowUpRight className="size-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

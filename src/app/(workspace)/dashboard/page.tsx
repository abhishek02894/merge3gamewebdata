import { getGamesWithLatestRelease } from "@/lib/data/games"
import { getDashboardData } from "@/lib/data/releases"
import { GameCard } from "@/components/game-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRelativeDate } from "@/lib/formatters"
import { Activity, Tag, TrendingUp, Zap } from "lucide-react"

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Tag className="size-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.totalReleases}</p>
              <p className="text-xs text-muted-foreground">Total Releases</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <TrendingUp className="size-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{stats.activeRollouts}</p>
              <p className="text-xs text-muted-foreground">Active Rollouts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Zap className="size-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.releasesThisMonth}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Games</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="size-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet</p>
          ) : (
            <ul className="space-y-2">
              {recentActivity.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{item.description}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {formatRelativeDate(item.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { getGamesWithLatestRelease } from "@/lib/data/games"
import { getDashboardData } from "@/lib/data/releases"

export async function GET() {
  try {
    const [games, dashboardData] = await Promise.all([
      getGamesWithLatestRelease(),
      getDashboardData(),
    ])

    return Response.json({
      games,
      ...dashboardData,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

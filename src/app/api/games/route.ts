import { createGameSchema } from "@/lib/schemas"
import { getGamesWithLatestRelease, createGame } from "@/lib/data/games"

export async function GET() {
  try {
    const games = await getGamesWithLatestRelease()
    return Response.json(games)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createGameSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const game = await createGame(parsed.data)
    return Response.json(game, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

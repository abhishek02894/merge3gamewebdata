import { prisma } from "@/lib/db"
import { getAllReleases } from "@/lib/data/releases"
import { createReleaseSchema } from "@/lib/schemas"
import type { ReleaseStatus } from "@prisma/client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameId = searchParams.get("gameId") ?? undefined
  const status = (searchParams.get("status") as ReleaseStatus) ?? undefined
  const page = Number(searchParams.get("page") ?? "1")

  try {
    const data = await getAllReleases({ gameId, status, page })
    return Response.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createReleaseSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const release = await prisma.release.create({
      data: {
        gameId: parsed.data.gameId,
        versionName: parsed.data.versionName,
        versionCode: parsed.data.versionCode,
        tagName: parsed.data.tagName,
        releaseDate: parsed.data.releaseDate
          ? new Date(parsed.data.releaseDate)
          : null,
        changelog: parsed.data.changelog,
        status: "DETECTED",
      },
    })

    return Response.json(release, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

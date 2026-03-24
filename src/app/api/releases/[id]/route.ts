import { prisma } from "@/lib/db"
import { getReleaseDetail } from "@/lib/data/releases"
import type { ReleaseStatus } from "@prisma/client"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const release = await getReleaseDetail(id)
    if (!release) {
      return Response.json({ error: "Release not found" }, { status: 404 })
    }
    return Response.json(release)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const release = await prisma.release.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status as ReleaseStatus }),
        ...(body.changelog !== undefined && { changelog: body.changelog }),
        ...(body.versionCode !== undefined && { versionCode: body.versionCode }),
      },
    })
    return Response.json(release)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

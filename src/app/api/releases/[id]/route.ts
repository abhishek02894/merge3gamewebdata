import { getReleaseDetail } from "@/lib/data/releases"

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

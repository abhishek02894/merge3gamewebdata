import { getReleasesByGame } from "@/lib/data/releases"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page") ?? "1")

  try {
    const data = await getReleasesByGame(id, page)
    return Response.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

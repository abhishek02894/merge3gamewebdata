import { verifyApiSecret } from "@/lib/api-auth"
import { playStoreIngestSchema } from "@/lib/schemas"
import { handlePlayStoreIngest } from "@/lib/services/playstore-ingest"

export async function POST(request: Request) {
  if (!verifyApiSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = playStoreIngestSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const result = await handlePlayStoreIngest(parsed.data)
    return Response.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

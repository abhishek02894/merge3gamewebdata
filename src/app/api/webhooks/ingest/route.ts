import { verifyApiSecret } from "@/lib/api-auth"
import { ingestPayloadSchema } from "@/lib/schemas"
import { handleIngest } from "@/lib/services/ingest"

export async function POST(request: Request) {
  if (!verifyApiSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = ingestPayloadSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const result = await handleIngest(parsed.data)
    return Response.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

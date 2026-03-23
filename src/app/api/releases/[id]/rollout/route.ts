import { prisma } from "@/lib/db"
import { createRolloutSchema } from "@/lib/schemas"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const parsed = createRolloutSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      )
    }

    // Verify release exists
    const release = await prisma.release.findUnique({ where: { id } })
    if (!release) {
      return Response.json({ error: "Release not found" }, { status: 404 })
    }

    const rollout = await prisma.rolloutEntry.create({
      data: {
        releaseId: id,
        percentage: parsed.data.percentage,
        status: parsed.data.status,
        track: parsed.data.track,
        notes: parsed.data.notes,
      },
    })

    // Update release status based on rollout
    const newStatus =
      parsed.data.percentage >= 100
        ? "COMPLETED"
        : parsed.data.status === "halted"
          ? "HALTED"
          : "ROLLING_OUT"

    await prisma.release.update({
      where: { id },
      data: { status: newStatus },
    })

    return Response.json(rollout, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error"
    return Response.json({ error: message }, { status: 500 })
  }
}

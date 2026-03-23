import { prisma } from "@/lib/db"
import type { IngestPayload } from "@/lib/types"

export async function handleIngest(payload: IngestPayload) {
  const game = await prisma.game.findUnique({
    where: { gitlabProjectId: payload.gitlabProjectId },
  })

  if (!game) {
    throw new Error(`Unknown GitLab project ID: ${payload.gitlabProjectId}`)
  }

  // Log the webhook event
  const webhookEvent = await prisma.webhookEvent.create({
    data: {
      gameId: game.id,
      eventType: payload.type,
      source: "gitlab",
      payload: JSON.parse(JSON.stringify(payload)),
    },
  })

  try {
    if (payload.type === "tag_push") {
      await handleTagPush(game.id, payload)
    } else {
      await handlePush(game.id, payload)
    }

    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processedAt: new Date() },
    })

    return { success: true, gameId: game.id, type: payload.type }
  } catch (error) {
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { error: error instanceof Error ? error.message : "Unknown error" },
    })
    throw error
  }
}

async function handleTagPush(gameId: string, payload: IngestPayload) {
  const tagName = payload.data.tagName ?? ""
  const versionName = tagName.replace(/^v/, "")

  // Find previous release to know what commits belong to this one
  const previousRelease = await prisma.release.findFirst({
    where: { gameId },
    orderBy: { createdAt: "desc" },
  })

  // Create the release
  const release = await prisma.release.create({
    data: {
      gameId,
      versionName,
      tagName,
      previousTag: previousRelease?.tagName ?? null,
      status: "DETECTED",
      releaseDate: new Date(),
    },
  })

  // Store commits from the webhook payload
  if (payload.data.commits.length > 0) {
    await storeCommits(gameId, release.id, payload.data.commits)
  }

  // Assign any unassigned commits (from previous push events) to this release
  await prisma.commit.updateMany({
    where: { gameId, releaseId: null },
    data: { releaseId: release.id },
  })

  return release
}

async function handlePush(gameId: string, payload: IngestPayload) {
  // Store commits without a release - they'll be assigned when a tag is pushed
  if (payload.data.commits.length > 0) {
    await storeCommits(gameId, null, payload.data.commits)
  }
}

async function storeCommits(
  gameId: string,
  releaseId: string | null,
  commits: IngestPayload["data"]["commits"]
) {
  for (const commit of commits) {
    await prisma.commit.upsert({
      where: {
        gameId_hash: { gameId, hash: commit.id },
      },
      update: {
        releaseId: releaseId ?? undefined,
      },
      create: {
        gameId,
        releaseId,
        hash: commit.id,
        shortHash: commit.id.substring(0, 7),
        message: commit.message,
        author: commit.author.name,
        authorEmail: commit.author.email,
        committedAt: new Date(commit.timestamp),
        url: commit.url,
      },
    })
  }
}

import { prisma } from "@/lib/db"
import type { PlayStoreIngestPayload } from "@/lib/types"
import type { ReleaseStatus } from "@prisma/client"

export async function handlePlayStoreIngest(payload: PlayStoreIngestPayload) {
  const game = await prisma.game.findUnique({
    where: { packageName: payload.packageName },
  })

  if (!game) {
    throw new Error(`Unknown package: ${payload.packageName}`)
  }

  // Log the webhook event
  await prisma.webhookEvent.create({
    data: {
      gameId: game.id,
      eventType: "playstore_update",
      source: "apify",
      payload: JSON.parse(JSON.stringify(payload)),
      processedAt: new Date(),
    },
  })

  // Find or create a release for this version
  let release = null
  if (payload.versionName) {
    release = await prisma.release.findFirst({
      where: {
        gameId: game.id,
        versionName: payload.versionName,
      },
      orderBy: { createdAt: "desc" },
    })

    if (!release) {
      // Create a release discovered from PlayStore
      release = await prisma.release.create({
        data: {
          gameId: game.id,
          versionName: payload.versionName,
          versionCode: payload.versionCode,
          tagName: `v${payload.versionName}`,
          status: mapRolloutStatus(payload.rolloutStatus),
          releaseDate: payload.updated ? new Date(payload.updated) : new Date(),
        },
      })
    }
  }

  if (!release) {
    return { success: true, message: "No version info to process" }
  }

  // Create rollout entry if we have rollout data
  if (payload.rolloutPercentage != null || payload.rolloutStatus) {
    await prisma.rolloutEntry.create({
      data: {
        releaseId: release.id,
        percentage: payload.rolloutPercentage ?? 0,
        status: payload.rolloutStatus ?? "unknown",
        track: payload.track ?? "production",
      },
    })
  }

  // Update release status
  const newStatus = mapRolloutStatus(payload.rolloutStatus)
  if (release.status !== newStatus) {
    await prisma.release.update({
      where: { id: release.id },
      data: {
        status: newStatus,
        versionCode: payload.versionCode ?? release.versionCode,
      },
    })
  }

  // Upsert build info
  if (payload.buildInfo) {
    await prisma.buildInfo.upsert({
      where: { releaseId: release.id },
      update: {
        buildNumber: payload.buildInfo.buildNumber,
        aabSizeBytes: payload.buildInfo.aabSizeBytes
          ? BigInt(payload.buildInfo.aabSizeBytes)
          : undefined,
        apkSizeBytes: payload.buildInfo.apkSizeBytes
          ? BigInt(payload.buildInfo.apkSizeBytes)
          : undefined,
        minSdkVersion: payload.buildInfo.minSdkVersion,
        targetSdkVersion: payload.buildInfo.targetSdkVersion,
        fetchedAt: new Date(),
      },
      create: {
        releaseId: release.id,
        buildNumber: payload.buildInfo.buildNumber,
        aabSizeBytes: payload.buildInfo.aabSizeBytes
          ? BigInt(payload.buildInfo.aabSizeBytes)
          : null,
        apkSizeBytes: payload.buildInfo.apkSizeBytes
          ? BigInt(payload.buildInfo.apkSizeBytes)
          : null,
        minSdkVersion: payload.buildInfo.minSdkVersion,
        targetSdkVersion: payload.buildInfo.targetSdkVersion,
      },
    })
  }

  return { success: true, releaseId: release.id, gameName: game.name }
}

function mapRolloutStatus(status: string | undefined): ReleaseStatus {
  if (!status) return "DETECTED"
  const s = status.toLowerCase()
  if (s === "completed" || s === "100") return "COMPLETED"
  if (s === "inprogress" || s === "in_progress" || s === "rolling_out") return "ROLLING_OUT"
  if (s === "halted") return "HALTED"
  if (s === "draft") return "DETECTED"
  if (s === "review" || s === "pending") return "REVIEW"
  return "DETECTED"
}

import { prisma } from "@/lib/db"
import type { ReleaseStatus } from "@prisma/client"

export async function getReleasesByGame(
  gameId: string,
  page = 1,
  pageSize = 20
) {
  const [releases, total] = await Promise.all([
    prisma.release.findMany({
      where: { gameId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: { select: { commits: true } },
        rolloutEntries: {
          orderBy: { fetchedAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.release.count({ where: { gameId } }),
  ])

  return {
    releases: releases.map((r) => ({
      ...r,
      commitCount: r._count.commits,
      latestRollout: r.rolloutEntries[0] ?? null,
    })),
    total,
    pages: Math.ceil(total / pageSize),
  }
}

export async function getReleaseDetail(id: string) {
  return prisma.release.findUnique({
    where: { id },
    include: {
      game: { select: { id: true, name: true, packageName: true } },
      commits: { orderBy: { committedAt: "desc" } },
      rolloutEntries: { orderBy: { fetchedAt: "desc" } },
      buildInfo: true,
    },
  })
}

export async function getAllReleases(filters?: {
  gameId?: string
  status?: ReleaseStatus
  page?: number
  pageSize?: number
}) {
  const page = filters?.page ?? 1
  const pageSize = filters?.pageSize ?? 20
  const where = {
    ...(filters?.gameId && { gameId: filters.gameId }),
    ...(filters?.status && { status: filters.status }),
  }

  const [releases, total] = await Promise.all([
    prisma.release.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        game: { select: { id: true, name: true } },
        _count: { select: { commits: true } },
        rolloutEntries: {
          orderBy: { fetchedAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.release.count({ where }),
  ])

  return {
    releases: releases.map((r) => ({
      ...r,
      commitCount: r._count.commits,
      latestRollout: r.rolloutEntries[0] ?? null,
    })),
    total,
    pages: Math.ceil(total / pageSize),
  }
}

export async function getDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalReleases, activeRollouts, releasesThisMonth, recentReleases, recentRollouts] =
    await Promise.all([
      prisma.release.count(),
      prisma.release.count({ where: { status: "ROLLING_OUT" } }),
      prisma.release.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.release.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { game: { select: { name: true, id: true } } },
      }),
      prisma.rolloutEntry.findMany({
        orderBy: { fetchedAt: "desc" },
        take: 5,
        include: {
          release: {
            include: { game: { select: { name: true, id: true } } },
          },
        },
      }),
    ])

  const recentActivity = [
    ...recentReleases.map((r) => ({
      id: r.id,
      type: "release" as const,
      gameName: r.game.name,
      gameId: r.game.id,
      description: `${r.game.name} v${r.versionName} - ${r.status}`,
      date: r.createdAt,
    })),
    ...recentRollouts.map((ro) => ({
      id: ro.id,
      type: "rollout" as const,
      gameName: ro.release.game.name,
      gameId: ro.release.game.id,
      description: `${ro.release.game.name} v${ro.release.versionName} rollout ${ro.percentage}%`,
      date: ro.fetchedAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10)

  return {
    stats: { totalReleases, activeRollouts, releasesThisMonth },
    recentActivity,
  }
}

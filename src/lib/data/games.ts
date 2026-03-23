import { prisma } from "@/lib/db"
import type { GameWithLatestRelease } from "@/lib/types"

export async function getGamesWithLatestRelease(): Promise<GameWithLatestRelease[]> {
  const games = await prisma.game.findMany({
    include: {
      releases: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          rolloutEntries: {
            orderBy: { fetchedAt: "desc" },
            take: 1,
          },
        },
      },
      _count: { select: { releases: true } },
    },
    orderBy: { name: "asc" },
  })

  return games.map((game) => {
    const latest = game.releases[0] ?? null
    return {
      id: game.id,
      name: game.name,
      packageName: game.packageName,
      iconUrl: game.iconUrl,
      description: game.description,
      latestRelease: latest
        ? {
            id: latest.id,
            versionName: latest.versionName,
            versionCode: latest.versionCode,
            tagName: latest.tagName,
            status: latest.status,
            releaseDate: latest.releaseDate,
            rolloutPercentage:
              latest.rolloutEntries[0]?.percentage ?? null,
          }
        : null,
      releaseCount: game._count.releases,
    }
  })
}

export async function getGameById(id: string) {
  return prisma.game.findUnique({
    where: { id },
    include: {
      _count: { select: { releases: true } },
    },
  })
}

export async function createGame(data: {
  name: string
  packageName: string
  gitlabProjectId: number
  gitlabRepoUrl: string
  playStoreAppId?: string
  iconUrl?: string
  description?: string
}) {
  return prisma.game.create({ data })
}

export async function updateGame(
  id: string,
  data: {
    name?: string
    packageName?: string
    gitlabProjectId?: number
    gitlabRepoUrl?: string
    playStoreAppId?: string | null
    iconUrl?: string | null
    description?: string | null
  }
) {
  return prisma.game.update({ where: { id }, data })
}

export async function deleteGame(id: string) {
  return prisma.game.delete({ where: { id } })
}

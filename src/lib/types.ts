import type { ReleaseStatus } from "@prisma/client"

export type GameWithLatestRelease = {
  id: string
  name: string
  packageName: string
  iconUrl: string | null
  description: string | null
  latestRelease: {
    id: string
    versionName: string
    versionCode: number | null
    tagName: string
    status: ReleaseStatus
    releaseDate: Date | null
    rolloutPercentage: number | null
  } | null
  releaseCount: number
}

export type ReleaseDetail = {
  id: string
  versionName: string
  versionCode: number | null
  tagName: string
  previousTag: string | null
  status: ReleaseStatus
  releaseDate: Date | null
  changelog: string | null
  createdAt: Date
  game: {
    id: string
    name: string
    packageName: string
  }
  commits: {
    id: string
    hash: string
    shortHash: string
    message: string
    author: string
    committedAt: Date
    url: string | null
  }[]
  rolloutEntries: {
    id: string
    percentage: number
    status: string
    track: string
    fetchedAt: Date
    notes: string | null
  }[]
  buildInfo: {
    buildNumber: string | null
    aabSizeBytes: bigint | null
    apkSizeBytes: bigint | null
    minSdkVersion: number | null
    targetSdkVersion: number | null
  } | null
}

export type DashboardData = {
  games: GameWithLatestRelease[]
  recentActivity: {
    id: string
    type: "release" | "rollout"
    gameName: string
    gameId: string
    description: string
    date: Date
  }[]
  stats: {
    totalReleases: number
    activeRollouts: number
    releasesThisMonth: number
  }
}

export type IngestPayload = {
  type: "tag_push" | "push"
  gitlabProjectId: number
  data: {
    tagName?: string
    ref?: string
    commits: {
      id: string
      message: string
      timestamp: string
      url?: string
      author: { name: string; email?: string }
    }[]
  }
}

export type PlayStoreIngestPayload = {
  packageName: string
  versionName?: string
  versionCode?: number
  rolloutPercentage?: number
  rolloutStatus?: string
  track?: string
  rating?: number
  installs?: string
  updated?: string
  buildInfo?: {
    buildNumber?: string
    aabSizeBytes?: number
    apkSizeBytes?: number
    minSdkVersion?: number
    targetSdkVersion?: number
  }
}

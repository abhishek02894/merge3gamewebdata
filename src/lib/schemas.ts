import { z } from "zod/v4"

export const ingestCommitSchema = z.object({
  id: z.string(),
  message: z.string(),
  timestamp: z.string(),
  url: z.string().optional(),
  author: z.object({
    name: z.string(),
    email: z.string().optional(),
  }),
})

export const ingestPayloadSchema = z.object({
  type: z.enum(["tag_push", "push"]),
  gitlabProjectId: z.number(),
  data: z.object({
    tagName: z.string().optional(),
    ref: z.string().optional(),
    commits: z.array(ingestCommitSchema),
  }),
})

export const playStoreIngestSchema = z.object({
  packageName: z.string(),
  versionName: z.string().optional(),
  versionCode: z.number().optional(),
  rolloutPercentage: z.number().min(0).max(100).optional(),
  rolloutStatus: z.string().optional(),
  track: z.string().optional(),
  rating: z.number().optional(),
  installs: z.string().optional(),
  updated: z.string().optional(),
  buildInfo: z
    .object({
      buildNumber: z.string().optional(),
      aabSizeBytes: z.number().optional(),
      apkSizeBytes: z.number().optional(),
      minSdkVersion: z.number().optional(),
      targetSdkVersion: z.number().optional(),
    })
    .optional(),
})

export const createGameSchema = z.object({
  name: z.string().min(1),
  packageName: z.string().min(1),
  gitlabProjectId: z.number(),
  gitlabRepoUrl: z.string().url(),
  playStoreAppId: z.string().optional(),
  iconUrl: z.string().url().optional(),
  description: z.string().optional(),
})

export const updateGameSchema = createGameSchema.partial()

export const createReleaseSchema = z.object({
  gameId: z.string(),
  versionName: z.string().min(1),
  versionCode: z.number().optional(),
  tagName: z.string().min(1),
  releaseDate: z.string().optional(),
  changelog: z.string().optional(),
})

export const createRolloutSchema = z.object({
  percentage: z.number().min(0).max(100),
  status: z.string().min(1),
  track: z.string().default("production"),
  notes: z.string().optional(),
})

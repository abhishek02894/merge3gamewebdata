import { z } from "zod/v4"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  API_SECRET: z.string(),
})

function getEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format())
    throw new Error("Invalid environment variables")
  }
  return parsed.data
}

export const env = getEnv()

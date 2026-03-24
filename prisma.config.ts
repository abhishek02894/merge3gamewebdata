import path from "node:path"
import { defineConfig } from "prisma/config"

// Load .env manually for Prisma CLI commands
import { config } from "dotenv"
config()

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})

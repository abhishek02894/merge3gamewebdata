import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const games = [
  {
    name: "Merge Home Town",
    packageName: "com.merge.hometown",
    gitlabProjectId: 38372846,
    gitlabRepoUrl: "https://gitlab.com/your-studio/merge-home-town",
    description: "A merge 3 puzzle game where you build and decorate your dream town.",
  },
  {
    name: "Tales and Dragon",
    packageName: "com.studio.talesanddragon",
    gitlabProjectId: 2,
    gitlabRepoUrl: "https://gitlab.com/your-studio/tales-and-dragon",
    description: "An epic merge adventure with dragons and magical tales.",
  },
  {
    name: "Word of Wizard",
    packageName: "com.studio.wordofwizard",
    gitlabProjectId: 3,
    gitlabRepoUrl: "https://gitlab.com/your-studio/word-of-wizard",
    description: "A magical word puzzle game with wizard themes.",
  },
]

async function main() {
  console.log("Seeding games...")

  for (const game of games) {
    const existing = await prisma.game.findUnique({
      where: { packageName: game.packageName },
    })

    if (existing) {
      console.log(`  Game "${game.name}" already exists, skipping.`)
      continue
    }

    await prisma.game.create({ data: game })
    console.log(`  Created game: ${game.name}`)
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const senhaHash = await bcrypt.hash("igreen@2026", 12)

  const user = await prisma.user.upsert({
    where: { email: "mikaellobatodiass@gmail.com" },
    update: {
      nome: "Mikael Lobato",
      cargo: "Desenvolvedor",
      area: "Tecnologia",
    },
    create: {
      nome: "Mikael Lobato",
      email: "mikaellobatodiass@gmail.com",
      senha: senhaHash,
      cargo: "Desenvolvedor",
      area: "Tecnologia",
    },
  })

  console.log(`✅ Usuário configurado: ${user.email}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

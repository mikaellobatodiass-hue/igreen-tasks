import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const senhaHash = await bcrypt.hash("igreen@2026", 12)

  const user = await prisma.user.upsert({
    where: { email: "diegocativeiroleopardo@gmail.com" },
    update: {},
    create: {
      nome: "Diego Cativeiro",
      email: "diegocativeiroleopardo@gmail.com",
      senha: senhaHash,
      cargo: "Desenvolvedor",
      area: "Tecnologia",
    },
  })

  console.log(`✅ Usuário criado: ${user.email}`)
  console.log(`🔑 Senha padrão: igreen@2026`)
  console.log(`⚠️  Altere a senha no primeiro acesso.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

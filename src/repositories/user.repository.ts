import { prisma } from "@/lib/prisma"
import type { UpdateProfileInput } from "@/validations/auth.validation"

export const userRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        area: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async create(data: { nome: string; email: string; senha: string; cargo?: string }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        area: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async update(id: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        area: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async updatePassword(id: string, senha: string) {
    return prisma.user.update({
      where: { id },
      data: { senha },
    })
  },
}

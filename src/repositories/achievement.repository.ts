import { prisma } from "@/lib/prisma"
import { Prisma, type AchievementCategory, type ImpactLevel } from "@/generated/prisma/client"
import type { CreateAchievementInput, UpdateAchievementInput, AchievementFiltersInput } from "@/validations/achievement.validation"

export const achievementRepository = {
  async findAll(userId: string, filters: AchievementFiltersInput = {}) {
    const where: Prisma.AchievementWhereInput = { userId }

    if (filters.categoria) {
      where.categoria = Array.isArray(filters.categoria)
        ? { in: filters.categoria as AchievementCategory[] }
        : (filters.categoria as AchievementCategory)
    }
    if (filters.impacto) {
      where.impacto = Array.isArray(filters.impacto)
        ? { in: filters.impacto as ImpactLevel[] }
        : (filters.impacto as ImpactLevel)
    }
    if (filters.dataInicio || filters.dataFim) {
      where.dataConquista = {
        ...(filters.dataInicio && { gte: new Date(filters.dataInicio) }),
        ...(filters.dataFim && { lte: new Date(filters.dataFim) }),
      }
    }
    if (filters.busca) {
      where.OR = [
        { titulo: { contains: filters.busca, mode: "insensitive" } },
        { descricao: { contains: filters.busca, mode: "insensitive" } },
      ]
    }

    return prisma.achievement.findMany({
      where,
      include: { task: true },
      orderBy: { dataConquista: "desc" },
    })
  },

  async findById(id: string, userId: string) {
    return prisma.achievement.findFirst({
      where: { id, userId },
      include: { task: true },
    })
  },

  async findByPeriod(userId: string, inicio: Date, fim: Date) {
    return prisma.achievement.findMany({
      where: {
        userId,
        dataConquista: { gte: inicio, lte: fim },
      },
      orderBy: { dataConquista: "desc" },
    })
  },

  async create(userId: string, data: CreateAchievementInput) {
    return prisma.achievement.create({
      data: {
        ...data,
        dataConquista: new Date(data.dataConquista),
        userId,
      },
      include: { task: true },
    })
  },

  async update(id: string, _userId: string, data: UpdateAchievementInput) {
    return prisma.achievement.update({
      where: { id },
      data: {
        ...data,
        ...(data.dataConquista && { dataConquista: new Date(data.dataConquista) }),
      },
      include: { task: true },
    })
  },

  async delete(id: string, _userId: string) {
    return prisma.achievement.delete({ where: { id } })
  },

  async countByCategory(userId: string) {
    return prisma.achievement.groupBy({
      by: ["categoria"],
      where: { userId },
      _count: { categoria: true },
    })
  },

  async existsForTask(taskId: string) {
    const count = await prisma.achievement.count({ where: { taskId } })
    return count > 0
  },
}

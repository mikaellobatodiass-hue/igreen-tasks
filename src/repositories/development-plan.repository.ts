import { prisma } from "@/lib/prisma"
import type { CreateDevelopmentPlanInput, UpdateDevelopmentPlanInput } from "@/validations/development-plan.validation"

export const developmentPlanRepository = {
  async findAll(userId: string) {
    return prisma.developmentPlan.findMany({
      where: { userId },
      orderBy: [{ status: "asc" }, { prazo: "asc" }],
    })
  },

  async findById(id: string, userId: string) {
    return prisma.developmentPlan.findFirst({ where: { id, userId } })
  },

  async create(userId: string, data: CreateDevelopmentPlanInput) {
    return prisma.developmentPlan.create({
      data: {
        ...data,
        prazo: new Date(data.prazo),
        userId,
      },
    })
  },

  async update(id: string, _userId: string, data: UpdateDevelopmentPlanInput) {
    return prisma.developmentPlan.update({
      where: { id },
      data: {
        ...data,
        ...(data.prazo && { prazo: new Date(data.prazo) }),
      },
    })
  },

  async delete(id: string, _userId: string) {
    return prisma.developmentPlan.delete({ where: { id } })
  },
}

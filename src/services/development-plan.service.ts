import { developmentPlanRepository } from "@/repositories/development-plan.repository"
import type {
  CreateDevelopmentPlanInput,
  UpdateDevelopmentPlanInput,
} from "@/validations/development-plan.validation"

export const developmentPlanService = {
  async list(userId: string) {
    return developmentPlanRepository.findAll(userId)
  },

  async getById(id: string, userId: string) {
    const plan = await developmentPlanRepository.findById(id, userId)
    if (!plan) throw new Error("Plano de desenvolvimento não encontrado")
    return plan
  },

  async create(userId: string, data: CreateDevelopmentPlanInput) {
    return developmentPlanRepository.create(userId, data)
  },

  async update(id: string, userId: string, data: UpdateDevelopmentPlanInput) {
    await this.getById(id, userId)

    if (data.progresso !== undefined && (data.progresso < 0 || data.progresso > 100)) {
      throw new Error("Progresso deve ser entre 0 e 100")
    }

    if (data.progresso === 100 && !data.status) {
      data.status = "CONCLUIDO"
    }

    return developmentPlanRepository.update(id, userId, data)
  },

  async delete(id: string, userId: string) {
    await this.getById(id, userId)
    return developmentPlanRepository.delete(id, userId)
  },
}

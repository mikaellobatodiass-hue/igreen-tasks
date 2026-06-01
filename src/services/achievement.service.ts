import { achievementRepository } from "@/repositories/achievement.repository"
import { taskRepository } from "@/repositories/task.repository"
import type {
  CreateAchievementInput,
  UpdateAchievementInput,
  CreateFromTaskInput,
  AchievementFiltersInput,
} from "@/validations/achievement.validation"

export const achievementService = {
  async list(userId: string, filters: AchievementFiltersInput = {}) {
    return achievementRepository.findAll(userId, filters)
  },

  async getById(id: string, userId: string) {
    const achievement = await achievementRepository.findById(id, userId)
    if (!achievement) throw new Error("Conquista não encontrada")
    return achievement
  },

  async create(userId: string, data: CreateAchievementInput) {
    if (data.taskId) {
      const task = await taskRepository.findById(data.taskId, userId)
      if (!task) throw new Error("Tarefa não encontrada")
      if (task.status !== "CONCLUIDO") {
        throw new Error("Só é possível criar uma conquista a partir de uma tarefa concluída")
      }
      const exists = await achievementRepository.existsForTask(data.taskId)
      if (exists) throw new Error("Já existe uma conquista vinculada a esta tarefa")
    }

    return achievementRepository.create(userId, data)
  },

  async createFromTask(userId: string, data: CreateFromTaskInput) {
    const task = await taskRepository.findById(data.taskId, userId)
    if (!task) throw new Error("Tarefa não encontrada")
    if (task.status !== "CONCLUIDO") {
      throw new Error("Tarefa ainda não foi concluída")
    }

    const exists = await achievementRepository.existsForTask(data.taskId)
    if (exists) throw new Error("Já existe uma conquista vinculada a esta tarefa")

    return achievementRepository.create(userId, {
      ...data,
      dataConquista: task.dataConclusao ?? new Date(),
    })
  },

  async update(id: string, userId: string, data: UpdateAchievementInput) {
    await this.getById(id, userId)
    return achievementRepository.update(id, userId, data)
  },

  async delete(id: string, userId: string) {
    await this.getById(id, userId)
    return achievementRepository.delete(id, userId)
  },
}

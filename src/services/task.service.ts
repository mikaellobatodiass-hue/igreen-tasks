import { taskRepository } from "@/repositories/task.repository"
import { achievementRepository } from "@/repositories/achievement.repository"
import type { CreateTaskInput, UpdateTaskInput, TaskFiltersInput, CompleteTaskInput } from "@/validations/task.validation"
import type { EisenhowerQuadrant } from "@/generated/prisma/client"

export const taskService = {
  async list(userId: string, filters: TaskFiltersInput = {}) {
    return taskRepository.findAll(userId, filters)
  },

  async getById(id: string, userId: string) {
    const task = await taskRepository.findById(id, userId)
    if (!task) throw new Error("Tarefa não encontrada")
    return task
  },

  async getEisenhowerBoard(userId: string) {
    const tasks = await taskRepository.findByEisenhowerQuadrant(userId)

    return {
      Q1_URGENTE_IMPORTANTE: tasks.filter((t) => t.quadranteEisenhower === "Q1_URGENTE_IMPORTANTE"),
      Q2_IMPORTANTE_NAO_URGENTE: tasks.filter((t) => t.quadranteEisenhower === "Q2_IMPORTANTE_NAO_URGENTE"),
      Q3_URGENTE_NAO_IMPORTANTE: tasks.filter((t) => t.quadranteEisenhower === "Q3_URGENTE_NAO_IMPORTANTE"),
      Q4_NAO_URGENTE_NAO_IMPORTANTE: tasks.filter((t) => t.quadranteEisenhower === "Q4_NAO_URGENTE_NAO_IMPORTANTE"),
      sem_quadrante: tasks.filter((t) => !t.quadranteEisenhower),
    }
  },

  async create(userId: string, data: CreateTaskInput) {
    return taskRepository.create(userId, data)
  },

  async update(id: string, userId: string, data: UpdateTaskInput) {
    await this.getById(id, userId)
    return taskRepository.update(id, userId, data)
  },

  async complete(id: string, userId: string, data: CompleteTaskInput) {
    const task = await this.getById(id, userId)

    if (task.status === "CONCLUIDO") {
      throw new Error("Tarefa já está concluída")
    }
    if (task.status === "CANCELADO") {
      throw new Error("Não é possível concluir uma tarefa cancelada")
    }

    const completed = await taskRepository.complete(
      id,
      userId,
      data.horasGastas,
      data.dataConclusao
    )

    return { task: completed, gerarConquista: data.gerarConquista }
  },

  async moveQuadrant(id: string, userId: string, quadranteEisenhower: EisenhowerQuadrant) {
    await this.getById(id, userId)
    return taskRepository.moveQuadrant(id, userId, quadranteEisenhower)
  },

  async delete(id: string, userId: string) {
    await this.getById(id, userId)

    const hasAchievement = await achievementRepository.existsForTask(id)
    if (hasAchievement) {
      throw new Error("Não é possível excluir uma tarefa que gerou uma conquista")
    }

    return taskRepository.delete(id, userId)
  },

  suggestQuadrant(prioridade: string, dataEntrega: Date): EisenhowerQuadrant {
    const diasParaEntrega = Math.ceil(
      (dataEntrega.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
    const urgente = diasParaEntrega <= 2
    const importante = prioridade === "ALTA"

    if (urgente && importante) return "Q1_URGENTE_IMPORTANTE"
    if (!urgente && importante) return "Q2_IMPORTANTE_NAO_URGENTE"
    if (urgente && !importante) return "Q3_URGENTE_NAO_IMPORTANTE"
    return "Q4_NAO_URGENTE_NAO_IMPORTANTE"
  },
}

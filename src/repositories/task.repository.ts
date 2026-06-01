import { prisma } from "@/lib/prisma"
import { Prisma, type TaskStatus, type TaskPriority, type TaskCategory, type EisenhowerQuadrant } from "@/generated/prisma/client"
import type { CreateTaskInput, UpdateTaskInput, TaskFiltersInput } from "@/validations/task.validation"

export const taskRepository = {
  async findAll(userId: string, filters: TaskFiltersInput = {}) {
    const where: Prisma.TaskWhereInput = { userId }

    if (filters.status) {
      where.status = Array.isArray(filters.status)
        ? { in: filters.status as TaskStatus[] }
        : (filters.status as TaskStatus)
    }
    if (filters.prioridade) {
      where.prioridade = Array.isArray(filters.prioridade)
        ? { in: filters.prioridade as TaskPriority[] }
        : (filters.prioridade as TaskPriority)
    }
    if (filters.categoria) {
      where.categoria = Array.isArray(filters.categoria)
        ? { in: filters.categoria as TaskCategory[] }
        : (filters.categoria as TaskCategory)
    }
    if (filters.quadranteEisenhower) {
      where.quadranteEisenhower = filters.quadranteEisenhower as EisenhowerQuadrant
    }
    if (filters.dataEntregaDe || filters.dataEntregaAte) {
      where.dataEntrega = {
        ...(filters.dataEntregaDe && { gte: new Date(filters.dataEntregaDe) }),
        ...(filters.dataEntregaAte && { lte: new Date(filters.dataEntregaAte) }),
      }
    }
    if (filters.busca) {
      where.OR = [
        { titulo: { contains: filters.busca, mode: "insensitive" } },
        { descricao: { contains: filters.busca, mode: "insensitive" } },
      ]
    }

    return prisma.task.findMany({
      where,
      orderBy: [{ prioridade: "asc" }, { dataEntrega: "asc" }],
    })
  },

  async findById(id: string, userId: string) {
    return prisma.task.findFirst({ where: { id, userId } })
  },

  async findByEisenhowerQuadrant(userId: string) {
    return prisma.task.findMany({
      where: {
        userId,
        status: { notIn: ["CONCLUIDO", "CANCELADO"] },
      },
      orderBy: { dataEntrega: "asc" },
    })
  },

  async create(userId: string, data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        ...data,
        dataInicio: new Date(data.dataInicio),
        dataEntrega: new Date(data.dataEntrega),
        userId,
      },
    })
  },

  async update(id: string, _userId: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(data.dataInicio && { dataInicio: new Date(data.dataInicio) }),
        ...(data.dataEntrega && { dataEntrega: new Date(data.dataEntrega) }),
        ...(data.dataConclusao && { dataConclusao: new Date(data.dataConclusao) }),
      },
    })
  },

  async complete(id: string, _userId: string, horasGastas: number, dataConclusao?: Date) {
    return prisma.task.update({
      where: { id },
      data: {
        status: "CONCLUIDO",
        horasGastas,
        dataConclusao: dataConclusao ?? new Date(),
      },
    })
  },

  async moveQuadrant(id: string, _userId: string, quadranteEisenhower: EisenhowerQuadrant) {
    return prisma.task.update({
      where: { id },
      data: { quadranteEisenhower },
    })
  },

  async delete(id: string, _userId: string) {
    return prisma.task.delete({ where: { id } })
  },

  async countByStatus(userId: string) {
    return prisma.task.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    })
  },

  async sumHoursByPeriod(userId: string, inicio: Date, fim: Date) {
    const result = await prisma.task.aggregate({
      where: {
        userId,
        status: "CONCLUIDO",
        dataConclusao: { gte: inicio, lte: fim },
      },
      _sum: { horasGastas: true },
      _count: { id: true },
    })
    return {
      totalHoras: result._sum.horasGastas ?? 0,
      totalTarefas: result._count.id,
    }
  },

  async findCompletedByPeriod(userId: string, inicio: Date, fim: Date) {
    return prisma.task.findMany({
      where: {
        userId,
        status: "CONCLUIDO",
        dataConclusao: { gte: inicio, lte: fim },
      },
      orderBy: { dataConclusao: "desc" },
    })
  },
}

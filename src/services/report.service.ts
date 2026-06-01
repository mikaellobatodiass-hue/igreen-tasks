import { taskRepository } from "@/repositories/task.repository"
import { achievementRepository } from "@/repositories/achievement.repository"
import type { TaskCategory } from "@/generated/prisma/client"

export const reportService = {
  async getDashboard(userId: string) {
    const hoje = new Date()
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - hoje.getDay())
    inicioSemana.setHours(0, 0, 0, 0)

    const [statusCount, horasSemana, tarefasPrioritarias, conquistasRecentes, allTasks] =
      await Promise.all([
        taskRepository.countByStatus(userId),
        taskRepository.sumHoursByPeriod(userId, inicioSemana, hoje),
        taskRepository.findAll(userId, {
          status: ["A_FAZER", "EM_ANDAMENTO"],
          prioridade: "ALTA",
        }),
        achievementRepository.findAll(userId, {}),
        taskRepository.findAll(userId, {}),
      ])

    const statusMap = Object.fromEntries(
      statusCount.map((s) => [s.status, s._count.status])
    )

    const atrasadas = allTasks.filter(
      (t) =>
        t.status !== "CONCLUIDO" &&
        t.status !== "CANCELADO" &&
        new Date(t.dataEntrega) < hoje
    ).length

    const concluidas = statusMap["CONCLUIDO"] ?? 0
    const total = allTasks.length
    const taxaConclusao = total > 0 ? Math.round((concluidas / total) * 100) : 0

    const produtividadeSemanal = await this.getWeeklyProductivity(userId)

    return {
      stats: {
        totalDemandas: total,
        demandasConcluidas: concluidas,
        demandasEmAndamento: statusMap["EM_ANDAMENTO"] ?? 0,
        demandasAFazer: statusMap["A_FAZER"] ?? 0,
        demandasAtrasadas: atrasadas,
        taxaConclusao,
        totalHorasTrabalhadas: horasSemana.totalHoras,
        mediaHorasPorDemanda:
          horasSemana.totalTarefas > 0
            ? Number((horasSemana.totalHoras / horasSemana.totalTarefas).toFixed(1))
            : 0,
      },
      tarefasPrioritarias: tarefasPrioritarias.slice(0, 5),
      conquistasRecentes: conquistasRecentes.slice(0, 3),
      produtividadeSemanal,
    }
  },

  async getWeeklyProductivity(userId: string) {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const result = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const inicio = new Date(date.setHours(0, 0, 0, 0))
      const fim = new Date(date.setHours(23, 59, 59, 999))

      const { totalHoras, totalTarefas } = await taskRepository.sumHoursByPeriod(
        userId,
        inicio,
        fim
      )

      result.push({
        diaSemana: days[inicio.getDay()],
        data: inicio.toISOString().split("T")[0],
        concluidas: totalTarefas,
        horas: totalHoras,
      })
    }

    return result
  },

  async getMonthlyReport(userId: string, inicio: Date, fim: Date) {
    const [tasks, achievements, categoryCount] = await Promise.all([
      taskRepository.findCompletedByPeriod(userId, inicio, fim),
      achievementRepository.findByPeriod(userId, inicio, fim),
      taskRepository.findAll(userId, {
        dataEntregaDe: inicio,
        dataEntregaAte: fim,
      }),
    ])

    const totalHoras = tasks.reduce((acc, t) => acc + (t.horasGastas ?? 0), 0)

    const categoryMap = new Map<string, number>()
    categoryCount.forEach((t) => {
      const atual = categoryMap.get(t.categoria) ?? 0
      categoryMap.set(t.categoria, atual + 1)
    })

    const distribuicaoPorCategoria = Array.from(categoryMap.entries()).map(
      ([categoria, quantidade]) => ({
        categoria: categoria as TaskCategory,
        quantidade,
        percentual:
          categoryCount.length > 0
            ? Math.round((quantidade / categoryCount.length) * 100)
            : 0,
      })
    )

    return {
      periodo: `${inicio.toLocaleDateString("pt-BR")} – ${fim.toLocaleDateString("pt-BR")}`,
      totalDemandas: categoryCount.length,
      demandasConcluidas: tasks.length,
      demandasEmAndamento: 0,
      demandasAFazer: 0,
      demandasAtrasadas: 0,
      taxaConclusao:
        categoryCount.length > 0
          ? Math.round((tasks.length / categoryCount.length) * 100)
          : 0,
      totalHorasTrabalhadas: totalHoras,
      mediaHorasPorDemanda:
        tasks.length > 0 ? Number((totalHoras / tasks.length).toFixed(1)) : 0,
      conquistas: achievements,
      distribuicaoPorCategoria,
      evolucaoMensal: [],
    }
  },
}

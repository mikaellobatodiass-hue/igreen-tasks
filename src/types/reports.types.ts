import type { TaskCategory, ImpactLevel } from "./enums"

export interface ReportPeriod {
  inicio: Date | string
  fim: Date | string
}

export interface ProductivityStats {
  totalDemandas: number
  demandasConcluidas: number
  demandasEmAndamento: number
  demandasAFazer: number
  demandasAtrasadas: number
  taxaConclusao: number
  totalHorasTrabalhadas: number
  mediaHorasPorDemanda: number
}

export interface AchievementStats {
  totalConquistas: number
  impactoMedio: ImpactLevel | null
  porCategoria: Record<string, number>
}

export interface DashboardData {
  stats: ProductivityStats
  achievementStats: AchievementStats
  tarefasPrioritarias: import("./task.types").Task[]
  conquistasRecentes: import("./achievement.types").Achievement[]
  produtividadeSemanal: WeeklyProductivity[]
}

export interface WeeklyProductivity {
  diaSemana: string
  data: string
  concluidas: number
  horas: number
}

export interface MonthlyReport extends ProductivityStats {
  periodo: string
  conquistas: import("./achievement.types").Achievement[]
  distribuicaoPorCategoria: CategoryDistribution[]
  evolucaoMensal: MonthlyEvolution[]
}

export interface CategoryDistribution {
  categoria: TaskCategory
  quantidade: number
  percentual: number
}

export interface MonthlyEvolution {
  mes: string
  concluidas: number
  horas: number
}

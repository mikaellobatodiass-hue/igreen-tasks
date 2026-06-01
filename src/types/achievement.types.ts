import type { AchievementCategory, ImpactLevel } from "./enums"
import type { Task } from "./task.types"

export interface Achievement {
  id: string
  titulo: string
  descricao: string
  categoria: AchievementCategory
  impacto: ImpactLevel
  dataConquista: Date
  evidencia: string | null
  userId: string
  taskId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AchievementWithTask extends Achievement {
  task: Task | null
}

export interface CreateAchievementInput {
  titulo: string
  descricao: string
  categoria: AchievementCategory
  impacto: ImpactLevel
  dataConquista: Date | string
  evidencia?: string
  taskId?: string
}

export interface UpdateAchievementInput {
  titulo?: string
  descricao?: string
  categoria?: AchievementCategory
  impacto?: ImpactLevel
  dataConquista?: Date | string
  evidencia?: string
}

export interface AchievementFilters {
  categoria?: AchievementCategory | AchievementCategory[]
  impacto?: ImpactLevel | ImpactLevel[]
  dataInicio?: Date | string
  dataFim?: Date | string
  busca?: string
}

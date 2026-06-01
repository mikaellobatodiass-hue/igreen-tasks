import type { DevelopmentPlanStatus } from "./enums"

export interface DevelopmentPlan {
  id: string
  titulo: string
  descricao: string | null
  status: DevelopmentPlanStatus
  progresso: number
  prazo: Date
  evidencia: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateDevelopmentPlanInput {
  titulo: string
  descricao?: string
  prazo: Date | string
  evidencia?: string
}

export interface UpdateDevelopmentPlanInput {
  titulo?: string
  descricao?: string
  status?: DevelopmentPlanStatus
  progresso?: number
  prazo?: Date | string
  evidencia?: string
}

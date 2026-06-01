import type {
  TaskCategory,
  TaskPriority,
  TaskStatus,
  EisenhowerQuadrant,
} from "./enums"

export interface Task {
  id: string
  titulo: string
  descricao: string | null
  categoria: TaskCategory
  prioridade: TaskPriority
  status: TaskStatus
  quadranteEisenhower: EisenhowerQuadrant | null
  dataInicio: Date
  dataEntrega: Date
  dataConclusao: Date | null
  horasGastas: number | null
  tags: string[]
  evidencia: string | null
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskInput {
  titulo: string
  descricao?: string
  categoria: TaskCategory
  prioridade: TaskPriority
  quadranteEisenhower?: EisenhowerQuadrant
  dataInicio: Date | string
  dataEntrega: Date | string
  horasGastas?: number
  tags?: string[]
  evidencia?: string
}

export interface UpdateTaskInput {
  titulo?: string
  descricao?: string
  categoria?: TaskCategory
  prioridade?: TaskPriority
  status?: TaskStatus
  quadranteEisenhower?: EisenhowerQuadrant | null
  dataInicio?: Date | string
  dataEntrega?: Date | string
  dataConclusao?: Date | string | null
  horasGastas?: number
  tags?: string[]
  evidencia?: string
}

export interface TaskFilters {
  status?: TaskStatus | TaskStatus[]
  prioridade?: TaskPriority | TaskPriority[]
  categoria?: TaskCategory | TaskCategory[]
  quadranteEisenhower?: EisenhowerQuadrant
  dataInicioDe?: Date | string
  dataInicioAte?: Date | string
  dataEntregaDe?: Date | string
  dataEntregaAte?: Date | string
  busca?: string
}

export interface TaskWithStats extends Task {
  diasParaEntrega: number
  atrasada: boolean
}

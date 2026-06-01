export const TaskCategory = {
  DESENVOLVIMENTO: "DESENVOLVIMENTO",
  GESTAO: "GESTAO",
  DOCUMENTACAO: "DOCUMENTACAO",
  REUNIAO: "REUNIAO",
  PESQUISA: "PESQUISA",
  OUTRO: "OUTRO",
} as const
export type TaskCategory = (typeof TaskCategory)[keyof typeof TaskCategory]

export const TaskPriority = {
  ALTA: "ALTA",
  MEDIA: "MEDIA",
  BAIXA: "BAIXA",
} as const
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]

export const TaskStatus = {
  A_FAZER: "A_FAZER",
  EM_ANDAMENTO: "EM_ANDAMENTO",
  CONCLUIDO: "CONCLUIDO",
  CANCELADO: "CANCELADO",
} as const
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const EisenhowerQuadrant = {
  Q1_URGENTE_IMPORTANTE: "Q1_URGENTE_IMPORTANTE",
  Q2_IMPORTANTE_NAO_URGENTE: "Q2_IMPORTANTE_NAO_URGENTE",
  Q3_URGENTE_NAO_IMPORTANTE: "Q3_URGENTE_NAO_IMPORTANTE",
  Q4_NAO_URGENTE_NAO_IMPORTANTE: "Q4_NAO_URGENTE_NAO_IMPORTANTE",
} as const
export type EisenhowerQuadrant = (typeof EisenhowerQuadrant)[keyof typeof EisenhowerQuadrant]

export const AchievementCategory = {
  TECNICA: "TECNICA",
  LIDERANCA: "LIDERANCA",
  INOVACAO: "INOVACAO",
  PROCESSO: "PROCESSO",
  COLABORACAO: "COLABORACAO",
  RESULTADO_NEGOCIO: "RESULTADO_NEGOCIO",
} as const
export type AchievementCategory = (typeof AchievementCategory)[keyof typeof AchievementCategory]

export const ImpactLevel = {
  MUITO_BAIXO: "MUITO_BAIXO",
  BAIXO: "BAIXO",
  MEDIO: "MEDIO",
  ALTO: "ALTO",
  MUITO_ALTO: "MUITO_ALTO",
} as const
export type ImpactLevel = (typeof ImpactLevel)[keyof typeof ImpactLevel]

export const DevelopmentPlanStatus = {
  NAO_INICIADO: "NAO_INICIADO",
  EM_ANDAMENTO: "EM_ANDAMENTO",
  CONCLUIDO: "CONCLUIDO",
  PAUSADO: "PAUSADO",
} as const
export type DevelopmentPlanStatus = (typeof DevelopmentPlanStatus)[keyof typeof DevelopmentPlanStatus]

// Labels para exibição na UI
export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  DESENVOLVIMENTO: "Desenvolvimento",
  GESTAO: "Gestão",
  DOCUMENTACAO: "Documentação",
  REUNIAO: "Reunião",
  PESQUISA: "Pesquisa",
  OUTRO: "Outro",
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  A_FAZER: "A Fazer",
  EM_ANDAMENTO: "Em Andamento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
}

export const EISENHOWER_QUADRANT_LABELS: Record<EisenhowerQuadrant, string> = {
  Q1_URGENTE_IMPORTANTE: "Q1 — Urgente e Importante",
  Q2_IMPORTANTE_NAO_URGENTE: "Q2 — Importante, Não Urgente",
  Q3_URGENTE_NAO_IMPORTANTE: "Q3 — Urgente, Não Importante",
  Q4_NAO_URGENTE_NAO_IMPORTANTE: "Q4 — Não Urgente e Não Importante",
}

export const ACHIEVEMENT_CATEGORY_LABELS: Record<AchievementCategory, string> = {
  TECNICA: "Técnica",
  LIDERANCA: "Liderança",
  INOVACAO: "Inovação",
  PROCESSO: "Processo",
  COLABORACAO: "Colaboração",
  RESULTADO_NEGOCIO: "Resultado de Negócio",
}

export const IMPACT_LEVEL_LABELS: Record<ImpactLevel, string> = {
  MUITO_BAIXO: "Muito Baixo",
  BAIXO: "Baixo",
  MEDIO: "Médio",
  ALTO: "Alto",
  MUITO_ALTO: "Muito Alto",
}

export const IMPACT_LEVEL_STARS: Record<ImpactLevel, number> = {
  MUITO_BAIXO: 1,
  BAIXO: 2,
  MEDIO: 3,
  ALTO: 4,
  MUITO_ALTO: 5,
}

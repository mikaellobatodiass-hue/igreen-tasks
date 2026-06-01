import { z } from "zod"

const AchievementCategoryEnum = z.enum([
  "TECNICA",
  "LIDERANCA",
  "INOVACAO",
  "PROCESSO",
  "COLABORACAO",
  "RESULTADO_NEGOCIO",
])

const ImpactLevelEnum = z.enum([
  "MUITO_BAIXO",
  "BAIXO",
  "MEDIO",
  "ALTO",
  "MUITO_ALTO",
])

export const createAchievementSchema = z.object({
  titulo: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(255, "Título deve ter no máximo 255 caracteres"),
  descricao: z
    .string()
    .min(10, "Descreva com mais detalhes o impacto desta conquista")
    .max(2000),
  categoria: AchievementCategoryEnum,
  impacto: ImpactLevelEnum,
  dataConquista: z.coerce.date(),
  evidencia: z.string().url("URL inválida").optional().or(z.literal("")),
  taskId: z.string().cuid("ID de tarefa inválido").optional(),
})

export const updateAchievementSchema = z.object({
  titulo: z.string().min(3).max(255).optional(),
  descricao: z.string().min(10).max(2000).optional(),
  categoria: AchievementCategoryEnum.optional(),
  impacto: ImpactLevelEnum.optional(),
  dataConquista: z.coerce.date().optional(),
  evidencia: z.string().url("URL inválida").optional().or(z.literal("")),
})

export const createFromTaskSchema = z.object({
  taskId: z.string().cuid("ID de tarefa inválido"),
  titulo: z.string().min(3).max(255),
  descricao: z.string().min(10).max(2000),
  categoria: AchievementCategoryEnum,
  impacto: ImpactLevelEnum,
  evidencia: z.string().url("URL inválida").optional().or(z.literal("")),
})

export const achievementFiltersSchema = z.object({
  categoria: z
    .union([AchievementCategoryEnum, z.array(AchievementCategoryEnum)])
    .optional(),
  impacto: z.union([ImpactLevelEnum, z.array(ImpactLevelEnum)]).optional(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
  busca: z.string().max(100).optional(),
})

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>
export type CreateFromTaskInput = z.infer<typeof createFromTaskSchema>
export type AchievementFiltersInput = z.infer<typeof achievementFiltersSchema>

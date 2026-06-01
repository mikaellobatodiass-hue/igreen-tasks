import { z } from "zod"

const DevelopmentPlanStatusEnum = z.enum([
  "NAO_INICIADO",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "PAUSADO",
])

export const createDevelopmentPlanSchema = z.object({
  titulo: z
    .string()
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(255),
  descricao: z.string().max(2000).optional(),
  prazo: z.coerce.date(),
  evidencia: z.string().url("URL inválida").optional().or(z.literal("")),
})

export const updateDevelopmentPlanSchema = z.object({
  titulo: z.string().min(3).max(255).optional(),
  descricao: z.string().max(2000).optional(),
  status: DevelopmentPlanStatusEnum.optional(),
  progresso: z.number().int().min(0).max(100).optional(),
  prazo: z.coerce.date().optional(),
  evidencia: z.string().url("URL inválida").optional().or(z.literal("")),
})

export type CreateDevelopmentPlanInput = z.infer<typeof createDevelopmentPlanSchema>
export type UpdateDevelopmentPlanInput = z.infer<typeof updateDevelopmentPlanSchema>

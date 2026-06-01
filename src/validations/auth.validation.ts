import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const updateProfileSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100).optional(),
  cargo: z.string().max(100).optional(),
  area: z.string().max(100).optional(),
  foto: z.string().url("URL de foto inválida").optional().or(z.literal("")),
})

export const changePasswordSchema = z
  .object({
    senhaAtual: z.string().min(6),
    novaSenha: z
      .string()
      .min(8, "Nova senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "Nova senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "Nova senha deve conter pelo menos um número"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

export const reportPeriodSchema = z
  .object({
    inicio: z.coerce.date(),
    fim: z.coerce.date(),
  })
  .refine((data) => data.fim >= data.inicio, {
    message: "A data de fim deve ser posterior à data de início",
    path: ["fim"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ReportPeriodInput = z.infer<typeof reportPeriodSchema>

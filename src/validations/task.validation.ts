import { z } from "zod";

const TaskCategoryEnum = z.enum([
  "DESENVOLVIMENTO",
  "GESTAO",
  "DOCUMENTACAO",
  "REUNIAO",
  "PESQUISA",
  "OUTRO",
]);

const TaskPriorityEnum = z.enum(["ALTA", "MEDIA", "BAIXA"]);

const TaskStatusEnum = z.enum([
  "A_FAZER",
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "CANCELADO",
]);

const EisenhowerQuadrantEnum = z.enum([
  "Q1_URGENTE_IMPORTANTE",
  "Q2_IMPORTANTE_NAO_URGENTE",
  "Q3_URGENTE_NAO_IMPORTANTE",
  "Q4_NAO_URGENTE_NAO_IMPORTANTE",
]);

export const createTaskSchema = z
  .object({
    titulo: z
      .string()
      .min(3, "Título deve ter pelo menos 3 caracteres")
      .max(255, "Título deve ter no máximo 255 caracteres"),
    descricao: z.string().max(2000).optional(),
    categoria: TaskCategoryEnum,
    prioridade: TaskPriorityEnum,
    quadranteEisenhower: EisenhowerQuadrantEnum.optional(),
    dataInicio: z.coerce.date(),
    dataEntrega: z.coerce.date(),
    horasGastas: z.number().min(0).max(9999).optional(),
    tags: z.array(z.string().max(50)).max(10).optional().default([]),
    evidencia: z.string().url("URL inválida").optional().or(z.literal("")),
  })
  .refine((data) => data.dataEntrega >= data.dataInicio, {
    message: "Data de entrega deve ser igual ou posterior à data de início",
    path: ["dataEntrega"],
  });

export const updateTaskSchema = z
  .object({
    titulo: z.string().min(3).max(255).optional(),
    descricao: z.string().max(2000).optional(),
    categoria: TaskCategoryEnum.optional(),
    prioridade: TaskPriorityEnum.optional(),
    status: TaskStatusEnum.optional(),
    quadranteEisenhower: EisenhowerQuadrantEnum.nullable().optional(),
    dataInicio: z.coerce.date().optional(),
    dataEntrega: z.coerce.date().optional(),
    dataConclusao: z.coerce.date().nullable().optional(),
    horasGastas: z.number().min(0).max(9999).optional(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    evidencia: z.string().url("URL inválida").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.dataEntrega && data.dataInicio) {
        return data.dataEntrega >= data.dataInicio;
      }
      return true;
    },
    {
      message: "Data de entrega deve ser igual ou posterior à data de início",
      path: ["dataEntrega"],
    },
  );

export const completeTaskSchema = z.object({
  horasGastas: z.number().min(0.1, "Informe pelo menos 0.1 hora").max(9999),
  dataConclusao: z.coerce.date().optional(),
  gerarConquista: z.boolean().optional().default(false),
});

export const moveQuadrantSchema = z.object({
  quadranteEisenhower: EisenhowerQuadrantEnum,
});

export const taskFiltersSchema = z.object({
  status: z.union([TaskStatusEnum, z.array(TaskStatusEnum)]).optional(),
  prioridade: z.union([TaskPriorityEnum, z.array(TaskPriorityEnum)]).optional(),
  categoria: z.union([TaskCategoryEnum, z.array(TaskCategoryEnum)]).optional(),
  quadranteEisenhower: EisenhowerQuadrantEnum.optional(),
  dataInicioDe: z.coerce.date().optional(),
  dataInicioAte: z.coerce.date().optional(),
  dataEntregaDe: z.coerce.date().optional(),
  dataEntregaAte: z.coerce.date().optional(),
  busca: z.string().max(100).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;
export type MoveQuadrantInput = z.infer<typeof moveQuadrantSchema>;
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;

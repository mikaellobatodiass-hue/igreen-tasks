import { NextRequest } from "next/server"
import { taskService } from "@/services/task.service"
import { updateTaskSchema } from "@/validations/task.validation"
import {
  getAuthenticatedUserId,
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params

  try {
    const task = await taskService.getById(id, userId)
    return successResponse(task)
  } catch {
    return notFoundResponse("Tarefa")
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params
  const body = await req.json()
  const parsed = updateTaskSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  try {
    const task = await taskService.update(id, userId, parsed.data)
    return successResponse(task)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao atualizar tarefa")
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params

  try {
    await taskService.delete(id, userId)
    return successResponse({ message: "Tarefa excluída com sucesso" })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao excluir tarefa")
  }
}

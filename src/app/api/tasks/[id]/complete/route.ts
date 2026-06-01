import { NextRequest } from "next/server"
import { taskService } from "@/services/task.service"
import { completeTaskSchema } from "@/validations/task.validation"
import {
  getAuthenticatedUserId,
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers"

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params
  const body = await req.json()
  const parsed = completeTaskSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  try {
    const result = await taskService.complete(id, userId, parsed.data)
    return successResponse(result)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao concluir tarefa")
  }
}

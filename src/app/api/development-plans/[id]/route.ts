import { NextRequest } from "next/server"
import { developmentPlanService } from "@/services/development-plan.service"
import { updateDevelopmentPlanSchema } from "@/validations/development-plan.validation"
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
    const plan = await developmentPlanService.getById(id, userId)
    return successResponse(plan)
  } catch {
    return notFoundResponse("Plano de desenvolvimento")
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params
  const body = await req.json()
  const parsed = updateDevelopmentPlanSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  try {
    const plan = await developmentPlanService.update(id, userId, parsed.data)
    return successResponse(plan)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao atualizar plano")
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params

  try {
    await developmentPlanService.delete(id, userId)
    return successResponse({ message: "Plano excluído com sucesso" })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao excluir plano")
  }
}

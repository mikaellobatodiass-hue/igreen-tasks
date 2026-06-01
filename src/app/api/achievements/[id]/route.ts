import { NextRequest } from "next/server"
import { achievementService } from "@/services/achievement.service"
import { updateAchievementSchema } from "@/validations/achievement.validation"
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
    const achievement = await achievementService.getById(id, userId)
    return successResponse(achievement)
  } catch {
    return notFoundResponse("Conquista")
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params
  const body = await req.json()
  const parsed = updateAchievementSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  try {
    const achievement = await achievementService.update(id, userId, parsed.data)
    return successResponse(achievement)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao atualizar conquista")
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const { id } = await params

  try {
    await achievementService.delete(id, userId)
    return successResponse({ message: "Conquista excluída com sucesso" })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao excluir conquista")
  }
}

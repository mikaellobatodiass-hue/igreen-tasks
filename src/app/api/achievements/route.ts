import { NextRequest } from "next/server"
import { achievementService } from "@/services/achievement.service"
import { createAchievementSchema, achievementFiltersSchema } from "@/validations/achievement.validation"
import {
  getAuthenticatedUserId,
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers"

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = achievementFiltersSchema.safeParse(params)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  const achievements = await achievementService.list(userId, parsed.data)
  return successResponse(achievements)
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const body = await req.json()
  const parsed = createAchievementSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  try {
    const achievement = await achievementService.create(userId, parsed.data)
    return successResponse(achievement, 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Erro ao criar conquista")
  }
}

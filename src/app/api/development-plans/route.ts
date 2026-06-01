import { NextRequest } from "next/server"
import { developmentPlanService } from "@/services/development-plan.service"
import { createDevelopmentPlanSchema } from "@/validations/development-plan.validation"
import {
  getAuthenticatedUserId,
  successResponse,
  validationErrorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers"

export async function GET() {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const plans = await developmentPlanService.list(userId)
  return successResponse(plans)
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const body = await req.json()
  const parsed = createDevelopmentPlanSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  const plan = await developmentPlanService.create(userId, parsed.data)
  return successResponse(plan, 201)
}

import { NextRequest } from "next/server"
import { userRepository } from "@/repositories/user.repository"
import { updateProfileSchema } from "@/validations/auth.validation"
import {
  getAuthenticatedUserId,
  successResponse,
  validationErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-helpers"

export async function GET() {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const user = await userRepository.findById(userId)
  if (!user) return notFoundResponse("Usuário")

  return successResponse(user)
}

export async function PATCH(req: NextRequest) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const body = await req.json()
  const parsed = updateProfileSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  const user = await userRepository.update(userId, parsed.data)
  return successResponse(user)
}

import { NextRequest } from "next/server"
import { taskService } from "@/services/task.service"
import { createTaskSchema, taskFiltersSchema } from "@/validations/task.validation"
import {
  getAuthenticatedUserId,
  successResponse,
  validationErrorResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers"

export async function GET(req: NextRequest) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = taskFiltersSchema.safeParse(params)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  const tasks = await taskService.list(userId, parsed.data)
  return successResponse(tasks)
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const body = await req.json()
  const parsed = createTaskSchema.safeParse(body)

  if (!parsed.success) return validationErrorResponse(parsed.error)

  const task = await taskService.create(userId, parsed.data)
  return successResponse(task, 201)
}

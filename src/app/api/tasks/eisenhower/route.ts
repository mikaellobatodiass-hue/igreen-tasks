import { taskService } from "@/services/task.service"
import {
  getAuthenticatedUserId,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-helpers"

export async function GET() {
  const userId = await getAuthenticatedUserId()
  if (!userId) return unauthorizedResponse()

  const board = await taskService.getEisenhowerBoard(userId)
  return successResponse(board)
}

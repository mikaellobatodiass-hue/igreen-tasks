import { NextRequest } from "next/server"
import { reportService } from "@/services/report.service"
import { reportPeriodSchema } from "@/validations/auth.validation"
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

  if (!params.inicio && !params.fim) {
    const dashboard = await reportService.getDashboard(userId)
    return successResponse(dashboard)
  }

  const parsed = reportPeriodSchema.safeParse(params)
  if (!parsed.success) return validationErrorResponse(parsed.error)

  const report = await reportService.getMonthlyReport(
    userId,
    parsed.data.inicio,
    parsed.data.fim
  )
  return successResponse(report)
}

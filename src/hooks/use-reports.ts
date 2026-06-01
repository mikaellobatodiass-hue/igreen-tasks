"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import type { DashboardData, MonthlyReport } from "@/types/reports.types"

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["reports", "dashboard"],
    queryFn: () => api.get<DashboardData>("/reports"),
    staleTime: 60_000,
  })
}

export function useMonthlyReport(inicio?: string, fim?: string) {
  return useQuery<MonthlyReport>({
    queryKey: ["reports", "monthly", inicio, fim],
    queryFn: () => api.get<MonthlyReport>(`/reports?inicio=${inicio}&fim=${fim}`),
    enabled: !!inicio && !!fim,
  })
}

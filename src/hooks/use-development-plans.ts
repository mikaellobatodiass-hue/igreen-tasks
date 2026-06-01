"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import type { DevelopmentPlan } from "@/types/development-plan.types"

export const PLANS_KEY = ["development-plans"] as const

export function useDevelopmentPlans() {
  return useQuery<DevelopmentPlan[]>({
    queryKey: PLANS_KEY,
    queryFn: () => api.get<DevelopmentPlan[]>("/development-plans"),
  })
}

export function useCreateDevelopmentPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post<DevelopmentPlan>("/development-plans", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY })
      toast.success("Plano criado!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateDevelopmentPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch<DevelopmentPlan>(`/development-plans/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY })
      toast.success("Plano atualizado!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteDevelopmentPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/development-plans/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PLANS_KEY })
      toast.success("Plano excluído!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import type { Achievement } from "@/types/achievement.types"

export const ACHIEVEMENTS_KEY = ["achievements"] as const

export function useAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ACHIEVEMENTS_KEY,
    queryFn: () => api.get<Achievement[]>("/achievements"),
  })
}

export function useCreateAchievement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post<Achievement>("/achievements", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACHIEVEMENTS_KEY })
      qc.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Conquista registrada!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateAchievement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch<Achievement>(`/achievements/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACHIEVEMENTS_KEY })
      toast.success("Conquista atualizada!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteAchievement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/achievements/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACHIEVEMENTS_KEY })
      toast.success("Conquista excluída!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

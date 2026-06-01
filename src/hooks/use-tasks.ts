"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import type { Task } from "@/types/task.types"

export const TASKS_KEY = ["tasks"] as const

export function useTasks(params?: Record<string, string>) {
  const query = params ? "?" + new URLSearchParams(params).toString() : ""
  return useQuery<Task[]>({
    queryKey: [...TASKS_KEY, params],
    queryFn: () => api.get<Task[]>(`/tasks${query}`),
  })
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: [...TASKS_KEY, id],
    queryFn: () => api.get<Task>(`/tasks/${id}`),
    enabled: !!id,
  })
}

export function useEisenhowerBoard() {
  return useQuery({
    queryKey: ["eisenhower"],
    queryFn: () => api.get<Record<string, Task[]>>("/tasks/eisenhower"),
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => api.post<Task>("/tasks", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: ["eisenhower"] })
      qc.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Demanda criada com sucesso!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch<Task>(`/tasks/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: ["eisenhower"] })
      toast.success("Demanda atualizada!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useCompleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.post(`/tasks/${id}/complete`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: ["reports"] })
      toast.success("Demanda concluída!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TASKS_KEY })
      qc.invalidateQueries({ queryKey: ["eisenhower"] })
      toast.success("Demanda excluída!")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useMoveQuadrant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quadranteEisenhower }: { id: string; quadranteEisenhower: string }) =>
      api.patch(`/tasks/${id}`, { quadranteEisenhower }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["eisenhower"] })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

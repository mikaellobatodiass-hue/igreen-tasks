"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/topbar"
import { useEisenhowerBoard, useMoveQuadrant } from "@/hooks/use-tasks"
import { Loader2, GripVertical } from "lucide-react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "@/types/task.types"

const QUADRANTS = [
  { key: "Q1_URGENTE_IMPORTANTE", label: "Q1 — Fazer Agora", sub: "Urgente + Importante", border: "#ff4d4d", bg: "rgba(255,77,77,0.05)" },
  { key: "Q2_IMPORTANTE_NAO_URGENTE", label: "Q2 — Planejar", sub: "Importante, Não Urgente", border: "#00ff87", bg: "rgba(0,255,135,0.05)" },
  { key: "Q3_URGENTE_NAO_IMPORTANTE", label: "Q3 — Delegar", sub: "Urgente, Não Importante", border: "#ffb800", bg: "rgba(255,184,0,0.05)" },
  { key: "Q4_NAO_URGENTE_NAO_IMPORTANTE", label: "Q4 — Eliminar", sub: "Não Urgente + Não Importante", border: "#555", bg: "rgba(80,80,80,0.05)" },
]

const PRIORITY_COLORS: Record<string, string> = { ALTA: "#ff4d4d", MEDIA: "#ffb800", BAIXA: "#00ff87" }
const PRIORITY_LABELS: Record<string, string> = { ALTA: "Alta", MEDIA: "Média", BAIXA: "Baixa" }

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isSortDragging ? 0.4 : 1 }

  return (
    <div ref={setNodeRef} style={style}
      className={`group flex items-start gap-2 rounded-lg border border-[#2a2a2a] bg-[#111] p-3 cursor-grab active:cursor-grabbing hover:border-[#3a3a3a] transition-all ${isDragging ? "shadow-xl" : ""}`}>
      <div {...attributes} {...listeners} className="mt-0.5 text-[#444] hover:text-[#888] shrink-0">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{task.titulo}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ color: PRIORITY_COLORS[task.prioridade], background: PRIORITY_COLORS[task.prioridade] + "22" }}>
            {PRIORITY_LABELS[task.prioridade]}
          </span>
          <span className="text-xs text-[#555]">
            {new Date(task.dataEntrega).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  )
}

function Quadrant({ config, tasks }: { config: typeof QUADRANTS[0]; tasks: Task[] }) {
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3 min-h-52"
      style={{ borderColor: config.border + "44", background: config.bg }}>
      <div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: config.border }} />
          <span className="text-sm font-semibold text-white">{config.label}</span>
          <span className="ml-auto text-xs text-[#888] bg-[#1a1a1a] px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <p className="text-xs text-[#888] mt-1 ml-4">{config.sub}</p>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 flex-1">
          {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
          {tasks.length === 0 && (
            <p className="text-xs text-[#555] text-center py-6">Arraste tarefas para cá</p>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function MatrizPage() {
  const { data: board, isLoading } = useEisenhowerBoard()
  const moveQuadrant = useMoveQuadrant()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const allTasks: Task[] = board ? Object.values(board).flat() : []

  function findQuadrant(taskId: string) {
    if (!board) return null
    for (const [key, tasks] of Object.entries(board)) {
      if ((tasks as Task[]).some((t) => t.id === taskId)) return key
    }
    return null
  }

  function handleDragStart(event: DragStartEvent) {
    const task = allTasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over || !board) return

    const fromQuadrant = findQuadrant(active.id as string)
    const toQuadrant = QUADRANTS.find((q) => {
      const tasks = board[q.key] as Task[] | undefined
      return tasks?.some((t) => t.id === over.id)
    })?.key ?? over.id as string

    if (fromQuadrant !== toQuadrant && QUADRANTS.some((q) => q.key === toQuadrant)) {
      moveQuadrant.mutate({ id: active.id as string, quadranteEisenhower: toQuadrant })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Matriz de Eisenhower" />
      <div className="flex-1 p-6 pt-20">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Matriz de Eisenhower</h2>
          <p className="text-sm text-[#888] mt-0.5">Arraste as tarefas entre os quadrantes para priorizar</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00ff87]" /></div>
        ) : board ? (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {QUADRANTS.map((q) => (
                <Quadrant key={q.key} config={q} tasks={(board[q.key] as Task[]) ?? []} />
              ))}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="rounded-lg border border-[#00ff87]/50 bg-[#1a3d2b] p-3 shadow-xl shadow-[#00ff87]/10">
                  <p className="text-sm text-white font-medium">{activeTask.titulo}</p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : null}

        {board && (
          <p className="mt-4 text-center text-xs text-[#555]">
            Tarefas sem quadrante: {(board.sem_quadrante as Task[] | undefined)?.length ?? 0} — vá em{" "}
            <a href="/demandas" className="text-[#00ff87] hover:underline">Demandas</a> para atribuir quadrantes
          </p>
        )}
      </div>
    </div>
  )
}

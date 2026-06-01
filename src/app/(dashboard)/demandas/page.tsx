"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/topbar"
import { useTasks, useDeleteTask, useCompleteTask } from "@/hooks/use-tasks"
import { TaskForm } from "@/components/tasks/task-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, CheckCircle2, Loader2, Search } from "lucide-react"
import type { Task } from "@/types/task.types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PRIORITY_COLORS: Record<string, string> = {
  ALTA: "bg-red-950 text-red-400 border-red-900",
  MEDIA: "bg-amber-950 text-amber-400 border-amber-900",
  BAIXA: "bg-green-950 text-green-400 border-green-900",
}
const STATUS_COLORS: Record<string, string> = {
  A_FAZER: "bg-zinc-900 text-zinc-400 border-zinc-800",
  EM_ANDAMENTO: "bg-blue-950 text-blue-400 border-blue-900",
  CONCLUIDO: "bg-green-950 text-green-400 border-green-900",
  CANCELADO: "bg-zinc-900 text-zinc-600 border-zinc-800",
}
const STATUS_LABELS: Record<string, string> = {
  A_FAZER: "A Fazer", EM_ANDAMENTO: "Em Andamento", CONCLUIDO: "Concluído", CANCELADO: "Cancelado"
}
const PRIORITY_LABELS: Record<string, string> = { ALTA: "Alta", MEDIA: "Média", BAIXA: "Baixa" }

function CompleteDialog({ task, onClose }: { task: Task; onClose: () => void }) {
  const complete = useCompleteTask()
  const [horas, setHoras] = useState("")
  const [minutos, setMinutos] = useState("")
  const totalHoras = (parseInt(horas || "0") + parseInt(minutos || "0") / 60)
  const tempoValido = totalHoras >= 0.01

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-[#2a2a2a] text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Concluir Demanda</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#888] -mt-1">{task.titulo}</p>
        <div className="space-y-2 mt-2">
          <Label className="text-[#888] text-xs uppercase tracking-wider">Tempo Gasto *</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Input type="number" min="0" max="999" value={horas} onChange={(e) => setHoras(e.target.value)}
                placeholder="0"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] pr-12" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555] pointer-events-none">hrs</span>
            </div>
            <div className="relative">
              <Input type="number" min="0" max="59" value={minutos} onChange={(e) => setMinutos(e.target.value)}
                placeholder="0"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] pr-12" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555] pointer-events-none">min</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="border-[#2a2a2a] text-[#888] hover:text-white hover:bg-[#1a1a1a]">Cancelar</Button>
          <Button disabled={!tempoValido || complete.isPending}
            onClick={() => complete.mutateAsync({ id: task.id, data: { horasGastas: totalHoras } }).then(onClose)}
            className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold">
            {complete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Concluir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DemandasPage() {
  const { data: tasks = [], isLoading } = useTasks()
  const deleteTask = useDeleteTask()
  const [formOpen, setFormOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [completeTask, setCompleteTask] = useState<Task | null>(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  const filtered = tasks.filter((t) => {
    const matchSearch = t.titulo.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "ALL" || t.status === filterStatus
    return matchSearch && matchStatus
  })

  function handleDelete(id: string) {
    if (confirm("Excluir esta demanda?")) deleteTask.mutate(id)
  }

  const isOverdue = (t: Task) =>
    t.status !== "CONCLUIDO" && t.status !== "CANCELADO" && new Date(t.dataEntrega) < new Date()

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Demandas" />
      <div className="flex-1 p-6 pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Gestão de Demandas</h2>
            <p className="text-sm text-[#888] mt-0.5">{tasks.length} demanda(s) no total</p>
          </div>
          <Button onClick={() => setFormOpen(true)}
            className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold gap-2">
            <Plus className="h-4 w-4" /> Nova Demanda
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-sm text-white placeholder-[#555] outline-none focus:border-[#00ff87]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["ALL", "A_FAZER", "EM_ANDAMENTO", "CONCLUIDO"].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-[#1a3d2b] text-[#00ff87] border border-[#00ff87]/30" : "bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] hover:text-white"}`}>
                {s === "ALL" ? "Todas" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00ff87]" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="h-12 w-12 text-[#2a2a2a] mb-3" />
            <p className="text-[#888]">{search ? "Nenhuma demanda encontrada." : "Nenhuma demanda ainda."}</p>
            {!search && <Button onClick={() => setFormOpen(true)} className="mt-4 bg-[#00ff87] text-black hover:bg-[#00cc6a]">Criar primeira demanda</Button>}
          </div>
        ) : (
          <div className="rounded-xl border border-[#2a2a2a] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#111] border-b border-[#2a2a2a]">
                <tr>
                  {["Título", "Categoria", "Prioridade", "Status", "Entrega", "Horas", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#888] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a] bg-[#0d0d0d]">
                {filtered.map((task) => (
                  <tr key={task.id} className={`hover:bg-[#111] transition-colors ${isOverdue(task) ? "border-l-2 border-l-red-600" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white truncate max-w-xs">{task.titulo}</div>
                      {task.descricao && <div className="text-xs text-[#888] truncate max-w-xs mt-0.5">{task.descricao}</div>}
                    </td>
                    <td className="px-4 py-3 text-[#888] text-xs">{task.categoria}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[task.prioridade]}`}>
                        {PRIORITY_LABELS[task.prioridade]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${STATUS_COLORS[task.status]}`}>
                        {STATUS_LABELS[task.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888] whitespace-nowrap">
                      <span className={isOverdue(task) ? "text-red-400" : ""}>
                        {new Date(task.dataEntrega).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#888]">
                      {task.horasGastas ? `${task.horasGastas}h` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {task.status !== "CONCLUIDO" && task.status !== "CANCELADO" && (
                          <button onClick={() => setCompleteTask(task)} title="Concluir"
                            className="p-1.5 rounded text-[#888] hover:text-[#00ff87] hover:bg-[#1a3d2b] transition">
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => setEditTask(task)} title="Editar"
                          className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1a1a1a] transition">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(task.id)} title="Excluir"
                          className="p-1.5 rounded text-[#888] hover:text-red-400 hover:bg-red-950 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskForm open={formOpen} onClose={() => setFormOpen(false)} />
      {editTask && <TaskForm open task={editTask} onClose={() => setEditTask(null)} />}
      {completeTask && <CompleteDialog task={completeTask} onClose={() => setCompleteTask(null)} />}
    </div>
  )
}

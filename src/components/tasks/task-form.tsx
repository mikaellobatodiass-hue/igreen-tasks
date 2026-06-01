"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks"
import { Loader2 } from "lucide-react"
import type { Task } from "@/types/task.types"

const CATEGORIES = ["DESENVOLVIMENTO", "GESTAO", "DOCUMENTACAO", "REUNIAO", "PESQUISA", "OUTRO"]
const CATEGORY_LABELS: Record<string, string> = {
  DESENVOLVIMENTO: "Desenvolvimento", GESTAO: "Gestão", DOCUMENTACAO: "Documentação",
  REUNIAO: "Reunião", PESQUISA: "Pesquisa", OUTRO: "Outro",
}
const PRIORITIES = ["ALTA", "MEDIA", "BAIXA"]
const PRIORITY_LABELS: Record<string, string> = { ALTA: "Alta", MEDIA: "Média", BAIXA: "Baixa" }
const QUADRANTS = [
  { value: "Q1_URGENTE_IMPORTANTE", label: "Q1 — Urgente e Importante" },
  { value: "Q2_IMPORTANTE_NAO_URGENTE", label: "Q2 — Importante, Não Urgente" },
  { value: "Q3_URGENTE_NAO_IMPORTANTE", label: "Q3 — Urgente, Não Importante" },
  { value: "Q4_NAO_URGENTE_NAO_IMPORTANTE", label: "Q4 — Não Urgente e Não Importante" },
]

interface Props {
  open: boolean
  onClose: () => void
  task?: Task
}

export function TaskForm({ open, onClose, task }: Props) {
  const isEdit = !!task
  const create = useCreateTask()
  const update = useUpdateTask()

  const [form, setForm] = useState({
    titulo: task?.titulo ?? "",
    descricao: task?.descricao ?? "",
    categoria: task?.categoria ?? "DESENVOLVIMENTO",
    prioridade: task?.prioridade ?? "MEDIA",
    quadranteEisenhower: task?.quadranteEisenhower ?? "",
    dataInicio: task?.dataInicio ? new Date(task.dataInicio).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    dataEntrega: task?.dataEntrega ? new Date(task.dataEntrega).toISOString().split("T")[0] : "",
    horasGastas: task?.horasGastas?.toString() ?? "",
  })

  const isPending = create.isPending || update.isPending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      titulo: form.titulo,
      descricao: form.descricao || undefined,
      categoria: form.categoria,
      prioridade: form.prioridade,
      quadranteEisenhower: form.quadranteEisenhower || undefined,
      dataInicio: form.dataInicio,
      dataEntrega: form.dataEntrega,
      horasGastas: form.horasGastas ? parseFloat(form.horasGastas) : undefined,
    }
    if (isEdit) {
      await update.mutateAsync({ id: task.id, data: payload })
    } else {
      await create.mutateAsync(payload)
    }
    onClose()
  }

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-[#2a2a2a] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Editar Demanda" : "Nova Demanda"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Título *</Label>
            <Input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} required
              className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] focus:ring-[#00ff87]/20" />
          </div>

          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => set("descricao", e.target.value)} rows={3}
              className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Categoria *</Label>
              <Select value={form.categoria} onValueChange={(v) => v !== null && set("categoria", v)}>
                <SelectTrigger className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="text-white hover:bg-[#222]">{CATEGORY_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Prioridade *</Label>
              <Select value={form.prioridade} onValueChange={(v) => v !== null && set("prioridade", v)}>
                <SelectTrigger className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className="text-white hover:bg-[#222]">{PRIORITY_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Quadrante Eisenhower</Label>
            <Select value={form.quadranteEisenhower} onValueChange={(v) => v !== null && set("quadranteEisenhower", v)}>
              <SelectTrigger className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue placeholder="Selecionar quadrante..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                {QUADRANTS.map((q) => (
                  <SelectItem key={q.value} value={q.value} className="text-white hover:bg-[#222]">{q.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Data de Início *</Label>
              <Input type="date" value={form.dataInicio} onChange={(e) => set("dataInicio", e.target.value)} required
                className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] [color-scheme:dark]" />
            </div>
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Data de Entrega *</Label>
              <Input type="date" value={form.dataEntrega} onChange={(e) => set("dataEntrega", e.target.value)} required
                className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] [color-scheme:dark]" />
            </div>
          </div>

          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Horas Gastas</Label>
            <Input type="number" step="0.5" min="0" value={form.horasGastas} onChange={(e) => set("horasGastas", e.target.value)}
              placeholder="0"
              className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}
              className="border-[#2a2a2a] text-[#888] hover:text-white hover:bg-[#1a1a1a]">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}
              className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

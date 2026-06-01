"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/topbar"
import { useDevelopmentPlans, useCreateDevelopmentPlan, useUpdateDevelopmentPlan, useDeleteDevelopmentPlan } from "@/hooks/use-development-plans"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react"
import type { DevelopmentPlan } from "@/types/development-plan.types"

const STATUS_LABELS: Record<string, string> = {
  NAO_INICIADO: "Não Iniciado", EM_ANDAMENTO: "Em Andamento", CONCLUIDO: "Concluído", PAUSADO: "Pausado"
}
const STATUS_COLORS: Record<string, string> = {
  NAO_INICIADO: "text-zinc-400 bg-zinc-900",
  EM_ANDAMENTO: "text-blue-400 bg-blue-950",
  CONCLUIDO: "text-green-400 bg-green-950",
  PAUSADO: "text-amber-400 bg-amber-950",
}

function PlanFormDialog({ plan, onClose }: { plan?: DevelopmentPlan; onClose: () => void }) {
  const create = useCreateDevelopmentPlan()
  const update = useUpdateDevelopmentPlan()
  const isEdit = !!plan

  const [form, setForm] = useState({
    titulo: plan?.titulo ?? "",
    descricao: plan?.descricao ?? "",
    prazo: plan?.prazo ? new Date(plan.prazo).toISOString().split("T")[0] : "",
    status: plan?.status ?? "NAO_INICIADO",
    progresso: plan?.progresso?.toString() ?? "0",
    evidencia: plan?.evidencia ?? "",
  })

  function set(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      titulo: form.titulo,
      descricao: form.descricao || undefined,
      prazo: form.prazo,
      status: isEdit ? form.status : undefined,
      progresso: isEdit ? parseInt(form.progresso) : undefined,
      evidencia: form.evidencia || undefined,
    }
    if (isEdit) { await update.mutateAsync({ id: plan.id, data: payload }) }
    else { await create.mutateAsync(payload) }
    onClose()
  }

  const isPending = create.isPending || update.isPending

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-[#2a2a2a] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Editar Plano" : "Novo Plano de Desenvolvimento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Título *</Label>
            <Input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} required
              className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
          </div>
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => set("descricao", e.target.value)} rows={2}
              className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Prazo *</Label>
              <Input type="date" value={form.prazo} onChange={(e) => set("prazo", e.target.value)} required
                className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] [color-scheme:dark]" />
            </div>
            {isEdit && (
              <div>
                <Label className="text-[#888] text-xs uppercase tracking-wider">Status</Label>
                <Select value={form.status} onValueChange={(v) => v !== null && set("status", v)}>
                  <SelectTrigger className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-white">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {isEdit && (
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Progresso: {form.progresso}%</Label>
              <input type="range" min="0" max="100" value={form.progresso}
                onChange={(e) => set("progresso", e.target.value)}
                className="mt-2 w-full accent-[#00ff87]" />
            </div>
          )}
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Link de Evidência</Label>
            <Input type="url" value={form.evidencia} onChange={(e) => set("evidencia", e.target.value)}
              placeholder="https://..." className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}
              className="border-[#2a2a2a] text-[#888] hover:text-white hover:bg-[#1a1a1a]">Cancelar</Button>
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

export default function PlanoPage() {
  const { data: plans = [], isLoading } = useDevelopmentPlans()
  const deletePlan = useDeleteDevelopmentPlan()
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<DevelopmentPlan | null>(null)

  function handleDelete(id: string) {
    if (confirm("Excluir este plano?")) deletePlan.mutate(id)
  }

  const isOverdue = (p: DevelopmentPlan) =>
    p.status !== "CONCLUIDO" && new Date(p.prazo) < new Date()

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Plano de Desenvolvimento" />
      <div className="flex-1 p-6 pt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Plano de Desenvolvimento</h2>
            <p className="text-sm text-[#888] mt-0.5">{plans.length} plano(s) ativo(s)</p>
          </div>
          <Button onClick={() => setFormOpen(true)} className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold gap-2">
            <Plus className="h-4 w-4" /> Novo Plano
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00ff87]" /></div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Target className="h-12 w-12 text-[#2a2a2a] mb-3" />
            <p className="text-[#888]">Nenhum plano criado ainda.</p>
            <Button onClick={() => setFormOpen(true)} className="mt-4 bg-[#00ff87] text-black hover:bg-[#00cc6a]">Criar primeiro plano</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div key={plan.id} className={`zoom-in rounded-xl border p-5 group ${isOverdue(plan) ? "border-red-900/50" : "border-[#2a2a2a]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white truncate">{plan.titulo}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[plan.status]}`}>
                        {STATUS_LABELS[plan.status]}
                      </span>
                    </div>
                    {plan.descricao && <p className="text-sm text-[#888] mt-1">{plan.descricao}</p>}
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setEditItem(plan)}
                      className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1a1a1a] transition">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(plan.id)}
                      className="p-1.5 rounded text-[#888] hover:text-red-400 hover:bg-red-950 transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-[#888]">
                    <span>Progresso</span>
                    <span className="text-[#00ff87] font-medium">{plan.progresso}%</span>
                  </div>
                  <Progress value={plan.progresso} className="h-1.5 bg-[#2a2a2a] [&>div]:bg-[#00ff87]" />
                </div>

                <div className="flex items-center justify-between mt-4 text-xs text-[#888]">
                  <span className={isOverdue(plan) ? "text-red-400" : ""}>
                    Prazo: {new Date(plan.prazo).toLocaleDateString("pt-BR")}
                  </span>
                  {plan.evidencia && (
                    <a href={plan.evidencia} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#00ff87] hover:underline">
                      <ExternalLink className="h-3 w-3" /> Evidência
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && <PlanFormDialog onClose={() => setFormOpen(false)} />}
      {editItem && <PlanFormDialog plan={editItem} onClose={() => setEditItem(null)} />}
    </div>
  )
}

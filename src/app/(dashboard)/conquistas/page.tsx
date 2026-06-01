"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/topbar"
import { useAchievements, useCreateAchievement, useUpdateAchievement, useDeleteAchievement } from "@/hooks/use-achievements"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react"
import type { Achievement } from "@/types/achievement.types"

const CATEGORIES = ["TECNICA", "LIDERANCA", "INOVACAO", "PROCESSO", "COLABORACAO", "RESULTADO_NEGOCIO"]
const CATEGORY_LABELS: Record<string, string> = {
  TECNICA: "Técnica", LIDERANCA: "Liderança", INOVACAO: "Inovação",
  PROCESSO: "Processo", COLABORACAO: "Colaboração", RESULTADO_NEGOCIO: "Resultado de Negócio"
}
const IMPACT_LEVELS = ["MUITO_BAIXO", "BAIXO", "MEDIO", "ALTO", "MUITO_ALTO"]
const IMPACT_LABELS: Record<string, string> = {
  MUITO_BAIXO: "Muito Baixo", BAIXO: "Baixo", MEDIO: "Médio", ALTO: "Alto", MUITO_ALTO: "Muito Alto"
}
const IMPACT_STARS: Record<string, number> = {
  MUITO_BAIXO: 1, BAIXO: 2, MEDIO: 3, ALTO: 4, MUITO_ALTO: 5
}
const CATEGORY_COLORS: Record<string, string> = {
  TECNICA: "text-blue-400 bg-blue-950", LIDERANCA: "text-purple-400 bg-purple-950",
  INOVACAO: "text-yellow-400 bg-yellow-950", PROCESSO: "text-cyan-400 bg-cyan-950",
  COLABORACAO: "text-pink-400 bg-pink-950", RESULTADO_NEGOCIO: "text-green-400 bg-green-950",
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < count ? "fill-[#ffb800] text-[#ffb800]" : "text-[#333]"}`} />
      ))}
    </div>
  )
}

function AchievementFormDialog({ achievement, onClose }: { achievement?: Achievement; onClose: () => void }) {
  const create = useCreateAchievement()
  const update = useUpdateAchievement()
  const isEdit = !!achievement

  const [form, setForm] = useState({
    titulo: achievement?.titulo ?? "",
    descricao: achievement?.descricao ?? "",
    categoria: achievement?.categoria ?? "TECNICA",
    impacto: achievement?.impacto ?? "MEDIO",
    dataConquista: achievement?.dataConquista
      ? new Date(achievement.dataConquista).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    evidencia: achievement?.evidencia ?? "",
  })

  function set(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...form, evidencia: form.evidencia || undefined }
    if (isEdit) { await update.mutateAsync({ id: achievement.id, data: payload }) }
    else { await create.mutateAsync(payload) }
    onClose()
  }

  const isPending = create.isPending || update.isPending

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-[#2a2a2a] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Editar Conquista" : "Nova Conquista"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Título *</Label>
            <Input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} required
              className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
          </div>
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Descrição do Impacto *</Label>
            <Textarea value={form.descricao} onChange={(e) => set("descricao", e.target.value)} required
              rows={3} placeholder="Descreva o resultado alcançado e o impacto no negócio..."
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
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="text-white">{CATEGORY_LABELS[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Impacto *</Label>
              <Select value={form.impacto} onValueChange={(v) => v !== null && set("impacto", v)}>
                <SelectTrigger className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  {IMPACT_LEVELS.map((i) => <SelectItem key={i} value={i} className="text-white">{IMPACT_LABELS[i]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Data da Conquista *</Label>
              <Input type="date" value={form.dataConquista} onChange={(e) => set("dataConquista", e.target.value)} required
                className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87] [color-scheme:dark]" />
            </div>
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Link de Evidência</Label>
              <Input type="url" value={form.evidencia} onChange={(e) => set("evidencia", e.target.value)}
                placeholder="https://..."
                className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}
              className="border-[#2a2a2a] text-[#888] hover:text-white hover:bg-[#1a1a1a]">Cancelar</Button>
            <Button type="submit" disabled={isPending}
              className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Salvar" : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ConquistasPage() {
  const { data: achievements = [], isLoading } = useAchievements()
  const deleteAchievement = useDeleteAchievement()
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<Achievement | null>(null)

  function handleDelete(id: string) {
    if (confirm("Excluir esta conquista?")) deleteAchievement.mutate(id)
  }

  const grouped = achievements.reduce<Record<string, Achievement[]>>((acc, a) => {
    const year = new Date(a.dataConquista).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(a)
    return acc
  }, {})

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Conquistas" />
      <div className="flex-1 p-6 pt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Conquistas Profissionais</h2>
            <p className="text-sm text-[#888] mt-0.5">{achievements.length} conquista(s) registrada(s)</p>
          </div>
          <Button onClick={() => setFormOpen(true)} className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold gap-2">
            <Plus className="h-4 w-4" /> Nova Conquista
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00ff87]" /></div>
        ) : achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Trophy className="h-12 w-12 text-[#2a2a2a] mb-3" />
            <p className="text-[#888]">Nenhuma conquista registrada ainda.</p>
            <Button onClick={() => setFormOpen(true)} className="mt-4 bg-[#00ff87] text-black hover:bg-[#00cc6a]">Registrar primeira conquista</Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a)).map(([year, items]) => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg font-bold text-[#00ff87]">{year}</span>
                  <div className="flex-1 h-px bg-[#2a2a2a]" />
                  <span className="text-xs text-[#888]">{items.length} conquista(s)</span>
                </div>
                <div className="space-y-3">
                  {items.map((a) => (
                    <div key={a.id} className="flex gap-4 rounded-xl border border-[#2a2a2a] bg-[#111] p-5 hover:border-[#00ff87]/20 transition-colors group">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a3d2b]">
                        <Trophy className="h-5 w-5 text-[#00ff87]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">{a.titulo}</p>
                            <p className="text-sm text-[#888] mt-1">{a.descricao}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button onClick={() => setEditItem(a)}
                              className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1a1a1a] transition">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(a.id)}
                              className="p-1.5 rounded text-[#888] hover:text-red-400 hover:bg-red-950 transition">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[a.categoria]}`}>
                            {CATEGORY_LABELS[a.categoria]}
                          </span>
                          <Stars count={IMPACT_STARS[a.impacto]} />
                          <span className="text-xs text-[#555]">
                            {new Date(a.dataConquista).toLocaleDateString("pt-BR")}
                          </span>
                          {a.evidencia && (
                            <a href={a.evidencia} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-[#00ff87] hover:underline">🔗 Evidência</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && <AchievementFormDialog onClose={() => setFormOpen(false)} />}
      {editItem && <AchievementFormDialog achievement={editItem} onClose={() => setEditItem(null)} />}
    </div>
  )
}

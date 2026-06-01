"use client"

import { useState } from "react"
import { Topbar } from "@/components/layout/topbar"
import { useMonthlyReport } from "@/hooks/use-reports"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts"
import { Loader2, CheckSquare, Clock, Trophy, TrendingUp } from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  DESENVOLVIMENTO: "Dev", GESTAO: "Gestão", DOCUMENTACAO: "Docs",
  REUNIAO: "Reunião", PESQUISA: "Pesquisa", OUTRO: "Outro",
}
const PIE_COLORS = ["#00ff87", "#00cc6a", "#ffb800", "#00b4ff", "#ff4d4d", "#888"]

function KpiCard({ icon: Icon, label, value, color = "#00ff87" }: {
  icon: React.ElementType; label: string; value: string | number; color?: string
}) {
  return (
    <div className="zoom-in rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#888] uppercase tracking-wider">{label}</span>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

export default function RelatoriosPage() {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const [inicio, setInicio] = useState(firstDay.toISOString().split("T")[0])
  const [fim, setFim] = useState(now.toISOString().split("T")[0])
  const [applied, setApplied] = useState({ inicio, fim })

  const { data, isLoading } = useMonthlyReport(applied.inicio, applied.fim)

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Relatórios" />
      <div className="flex-1 p-6 pt-20">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Relatórios de Produtividade</h2>
          <p className="text-sm text-[#888] mt-0.5">Análise do seu desempenho no período selecionado</p>
        </div>

        {/* Period selector */}
        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-[#2a2a2a] bg-[#111] p-4">
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Início</Label>
            <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)}
              className="mt-1 w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white [color-scheme:dark]" />
          </div>
          <div>
            <Label className="text-[#888] text-xs uppercase tracking-wider">Fim</Label>
            <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)}
              className="mt-1 w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white [color-scheme:dark]" />
          </div>
          <Button onClick={() => setApplied({ inicio, fim })}
            className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold">
            Aplicar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#00ff87]" /></div>
        ) : data ? (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard icon={CheckSquare} label="Demandas Criadas" value={data.totalDemandas} />
              <KpiCard icon={TrendingUp} label="Concluídas" value={data.demandasConcluidas} color="#00ff87" />
              <KpiCard icon={Clock} label="Horas Trabalhadas" value={`${data.totalHorasTrabalhadas}h`} color="#00b4ff" />
              <KpiCard icon={Trophy} label="Taxa de Conclusão" value={`${data.taxaConclusao}%`} color="#ffb800" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Pie chart */}
              {data.distribuicaoPorCategoria?.length > 0 && (
                <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
                  <h3 className="font-semibold text-white mb-4">Demandas por Categoria</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={data.distribuicaoPorCategoria.map((d, i) => ({
                          ...d,
                          fill: PIE_COLORS[i % PIE_COLORS.length],
                          name: CATEGORY_LABELS[d.categoria] ?? d.categoria,
                        }))}
                        dataKey="quantidade"
                        nameKey="name"
                        cx="50%" cy="50%" outerRadius={80}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      />
                      <Tooltip
                        contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
                        labelStyle={{ color: "#fff" }}
                        formatter={(v) => [v, "tarefas"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Conquistas do período */}
              <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
                <h3 className="font-semibold text-white mb-4">Conquistas do Período</h3>
                {data.conquistas?.length === 0 ? (
                  <p className="text-sm text-[#888] py-8 text-center">Nenhuma conquista no período</p>
                ) : (
                  <ul className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {data.conquistas?.map((a) => (
                      <li key={a.id} className="flex items-center gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                        <Trophy className="h-4 w-4 text-[#00ff87] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{a.titulo}</p>
                          <p className="text-xs text-[#888]">{new Date(a.dataConquista).toLocaleDateString("pt-BR")}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Summary text */}
            <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
              <h3 className="font-semibold text-white mb-2">Resumo do Período</h3>
              <p className="text-sm text-[#888]">
                {data.periodo} — {data.demandasConcluidas} demanda(s) concluídas de {data.totalDemandas} criadas,
                totalizando <span className="text-[#00ff87] font-semibold">{data.totalHorasTrabalhadas}h</span> trabalhadas
                com média de <span className="text-[#00ff87] font-semibold">{data.mediaHorasPorDemanda}h</span> por demanda.
                Taxa de conclusão: <span className="text-[#00ff87] font-semibold">{data.taxaConclusao}%</span>.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

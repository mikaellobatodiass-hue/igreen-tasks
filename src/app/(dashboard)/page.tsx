"use client"

import { Topbar } from "@/components/layout/topbar"
import { useDashboard } from "@/hooks/use-reports"
import { useSession } from "next-auth/react"
import { CheckSquare, Clock, Trophy, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { TASK_PRIORITY_LABELS } from "@/types/enums"
import Link from "next/link"
import type { Task } from "@/types/task.types"
import type { Achievement } from "@/types/achievement.types"

const PRIORITY_COLORS: Record<string, string> = {
  ALTA: "#ff4d4d",
  MEDIA: "#ffb800",
  BAIXA: "#00ff87",
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Bom dia"
  if (h < 18) return "Boa tarde"
  return "Boa noite"
}

function KpiCard({ icon: Icon, label, value, color = "#00ff87" }: {
  icon: React.ElementType; label: string; value: number | string; color?: string
}) {
  return (
    <div className="zoom-in rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#888] uppercase tracking-wider">{label}</span>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ color: PRIORITY_COLORS[priority], background: PRIORITY_COLORS[priority] + "22" }}>
      {TASK_PRIORITY_LABELS[priority as keyof typeof TASK_PRIORITY_LABELS] ?? priority}
    </span>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data, isLoading } = useDashboard()

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Dashboard" />
      <div className="flex-1 p-6 pt-20">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {greeting()}, {session?.user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-[#888] text-sm mt-1 capitalize">{today}</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#00ff87]" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard icon={CheckSquare} label="Total de Demandas" value={data.stats.totalDemandas} />
              <KpiCard icon={TrendingUp} label="Concluídas" value={data.stats.demandasConcluidas} color="#00ff87" />
              <KpiCard icon={Clock} label="Horas (semana)" value={`${data.stats.totalHorasTrabalhadas}h`} color="#00b4ff" />
              <KpiCard icon={Trophy} label="Taxa de Entrega" value={`${data.stats.taxaConclusao}%`} color="#ffb800" />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Priority tasks */}
              <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Tarefas Prioritárias</h3>
                  <Link href="/demandas" className="text-xs text-[#00ff87] hover:underline">Ver todas →</Link>
                </div>
                {data.tarefasPrioritarias.length === 0 ? (
                  <p className="text-sm text-[#888] py-8 text-center">Nenhuma tarefa prioritária pendente 🎉</p>
                ) : (
                  <ul className="space-y-3">
                    {data.tarefasPrioritarias.map((task: Task) => (
                      <li key={task.id} className="flex items-center justify-between gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{task.titulo}</p>
                          <p className="text-xs text-[#888]">
                            {new Date(task.dataEntrega).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <PriorityBadge priority={task.prioridade} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Weekly chart */}
              <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
                <h3 className="font-semibold text-white mb-4">Produtividade da Semana</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data.produtividadeSemanal}>
                    <XAxis dataKey="diaSemana" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
                      labelStyle={{ color: "#fff" }}
                      itemStyle={{ color: "#00ff87" }}
                      formatter={(v) => [`${v} concluídas`, ""]}
                    />
                    <Bar dataKey="concluidas" radius={[4, 4, 0, 0]} fill="#00ff87" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: Alerts + Recent achievements */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {data.stats.demandasAtrasadas > 0 && (
                <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">
                    Você tem <strong>{data.stats.demandasAtrasadas}</strong> demanda(s) em atraso.{" "}
                    <Link href="/demandas" className="underline">Ver demandas</Link>
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Conquistas Recentes</h3>
                  <Link href="/conquistas" className="text-xs text-[#00ff87] hover:underline">Ver todas →</Link>
                </div>
                {data.conquistasRecentes.length === 0 ? (
                  <p className="text-sm text-[#888] py-4 text-center">Nenhuma conquista ainda. <Link href="/conquistas" className="text-[#00ff87]">Registre a primeira!</Link></p>
                ) : (
                  <ul className="space-y-3">
                    {data.conquistasRecentes.map((a: Achievement) => (
                      <li key={a.id} className="flex items-center gap-3">
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
          </div>
        ) : null}
      </div>
    </div>
  )
}

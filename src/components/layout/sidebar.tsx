"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, CheckSquare, Grid2X2, Trophy, Target, BarChart3, User, ChevronLeft, ChevronRight, Zap
} from "lucide-react"
import { useState } from "react"

const nav = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/demandas", icon: CheckSquare, label: "Demandas" },
  { href: "/matriz", icon: Grid2X2, label: "Matriz Eisenhower" },
  { href: "/conquistas", icon: Trophy, label: "Conquistas" },
  { href: "/plano", icon: Target, label: "Plano de Dev" },
  { href: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/perfil", icon: User, label: "Perfil" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col border-r border-[#2a2a2a] bg-[#111] transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#2a2a2a] px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00ff87]">
            <Zap className="h-4 w-4 text-black" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white tracking-tight truncate">iGreen Tasks</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {nav.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-[#1a3d2b] text-[#00ff87] border-l-2 border-[#00ff87]"
                      : "text-[#888] hover:text-white hover:bg-[#1a1a1a]",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-12 items-center justify-center border-t border-[#2a2a2a] text-[#888] hover:text-[#00ff87] transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}

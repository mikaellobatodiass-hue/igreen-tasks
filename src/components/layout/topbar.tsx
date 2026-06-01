"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"

interface TopbarProps { title: string }

export function Topbar({ title }: TopbarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const initials = session?.user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "U"

  return (
    <header
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur px-6"
      style={{ left: 240 }}
    >
      <h1 className="text-lg font-semibold text-white">{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#1a1a1a] transition-colors outline-none">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#1a3d2b] text-[#00ff87] text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm text-[#888] sm:block">{session?.user?.name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#2a2a2a] text-white min-w-40">
          <DropdownMenuItem
            className="cursor-pointer gap-2 hover:bg-[#222]"
            onClick={() => router.push("/perfil")}
          >
            <User className="h-4 w-4" /> Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#2a2a2a]" />
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-red-400 hover:bg-[#2a1a1a] focus:text-red-400"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

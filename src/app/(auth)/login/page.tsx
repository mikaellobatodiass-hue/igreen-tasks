"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn("credentials", {
        email,
        senha,
        redirect: false,
      })
      if (res?.error) {
        toast.error("E-mail ou senha inválidos")
      } else {
        router.push("/")
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Hexagonal background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2L2 50V18L28 2l26 16v32L28 64z' fill='%2300ff87' fill-opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Green horizon glow */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#00ff87] opacity-30 blur-sm" />
      <div className="absolute inset-x-0 top-1/2 h-32 -translate-y-full bg-gradient-to-t from-[#00ff87]/10 to-transparent" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#111]/80 p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff87] shadow-lg shadow-[#00ff87]/20">
              <Zap className="h-7 w-7 text-black" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">iGreen Tasks</h1>
              <p className="mt-1 text-sm text-[#888]">Organize. Priorize. Evolua.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 pr-11 text-sm text-white placeholder-[#555] outline-none transition focus:border-[#00ff87] focus:ring-1 focus:ring-[#00ff87]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00ff87] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#00cc6a] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#00ff87]/20"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#555]">
            iGreen Tasks · Gestão de Produtividade
          </p>
        </div>
      </div>
    </div>
  )
}

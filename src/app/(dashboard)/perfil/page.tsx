"use client"

import { useState, useEffect } from "react"
import { Topbar } from "@/components/layout/topbar"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

interface Profile {
  id: string; nome: string; email: string; cargo: string | null; area: string | null; foto: string | null; createdAt: string
}

export default function PerfilPage() {
  const { update: updateSession } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nome: "", cargo: "", area: "" })

  useEffect(() => {
    api.get<Profile>("/profile").then((p) => {
      setProfile(p)
      setForm({ nome: p.nome, cargo: p.cargo ?? "", area: p.area ?? "" })
    }).finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await api.patch<Profile>("/profile", {
        nome: form.nome || undefined,
        cargo: form.cargo || undefined,
        area: form.area || undefined,
      })
      setProfile(updated)
      await updateSession({ name: updated.nome })
      toast.success("Perfil atualizado!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  function set(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })) }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Topbar title="Perfil" />
        <div className="flex-1 flex items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#00ff87]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Perfil" />
      <div className="flex-1 p-6 pt-20 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Meu Perfil</h2>
          <p className="text-sm text-[#888] mt-0.5">Gerencie suas informações profissionais</p>
        </div>

        {/* Avatar section */}
        <div className="mb-6 flex items-center gap-5 rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1a3d2b] text-[#00ff87] text-2xl font-bold">
            {profile?.nome.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "U"}
          </div>
          <div>
            <p className="font-semibold text-white text-lg">{profile?.nome}</p>
            <p className="text-sm text-[#888]">{profile?.email}</p>
            {profile?.cargo && <p className="text-xs text-[#00ff87] mt-1">{profile.cargo}{profile.area ? ` · ${profile.area}` : ""}</p>}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
          <h3 className="font-semibold text-white mb-4">Informações Profissionais</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Nome</Label>
              <Input value={form.nome} onChange={(e) => set("nome", e.target.value)}
                className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
            </div>
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">E-mail</Label>
              <Input value={profile?.email ?? ""} disabled
                className="mt-1 bg-[#111] border-[#2a2a2a] text-[#555]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#888] text-xs uppercase tracking-wider">Cargo</Label>
                <Input value={form.cargo} onChange={(e) => set("cargo", e.target.value)}
                  placeholder="Ex: Desenvolvedor Sênior"
                  className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
              </div>
              <div>
                <Label className="text-[#888] text-xs uppercase tracking-wider">Área</Label>
                <Input value={form.area} onChange={(e) => set("area", e.target.value)}
                  placeholder="Ex: Tecnologia"
                  className="mt-1 bg-[#1a1a1a] border-[#2a2a2a] text-white focus:border-[#00ff87]" />
              </div>
            </div>
            <div>
              <Label className="text-[#888] text-xs uppercase tracking-wider">Membro desde</Label>
              <Input value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("pt-BR") : ""} disabled
                className="mt-1 bg-[#111] border-[#2a2a2a] text-[#555]" />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={saving}
                className="bg-[#00ff87] text-black hover:bg-[#00cc6a] font-semibold gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="mt-4 rounded-xl border border-[#2a2a2a] bg-[#111] p-5">
          <h3 className="font-semibold text-white mb-1">Conta</h3>
          <p className="text-sm text-[#888]">
            Para alterar sua senha, entre em contato com o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  )
}

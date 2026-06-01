export interface User {
  id: string
  nome: string
  email: string
  cargo: string | null
  area: string | null
  foto: string | null
  createdAt: Date
  updatedAt: Date
}

export type UserWithoutPassword = User

export interface UpdateProfileInput {
  nome?: string
  cargo?: string
  area?: string
  foto?: string
}

export interface ChangePasswordInput {
  senhaAtual: string
  novaSenha: string
}

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { loginSchema } from "@/validations/auth.validation"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user) return null

        const senhaValida = await bcrypt.compare(parsed.data.senha, user.senha)
        if (!senhaValida) return null

        return {
          id: user.id,
          name: user.nome,
          email: user.email,
          cargo: user.cargo,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.cargo = (user as { cargo?: string }).cargo
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { nome: true, email: true, cargo: true },
        })
        if (freshUser) {
          session.user.name = freshUser.nome
          session.user.email = freshUser.email
          session.user.cargo = freshUser.cargo ?? undefined
        }
        session.user.id = token.id as string
      }
      return session
    },
  },
})

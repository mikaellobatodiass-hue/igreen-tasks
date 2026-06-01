import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Usa apenas authConfig — sem Prisma, sem pg, compatível com Edge Runtime
export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

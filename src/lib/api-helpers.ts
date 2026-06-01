import { NextResponse } from "next/server"
import { auth } from "./auth"
import type { ZodError } from "zod"

export async function getAuthenticatedUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function validationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      error: "Dados inválidos",
      details: error.flatten().fieldErrors,
    },
    { status: 422 }
  )
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
}

export function notFoundResponse(resource = "Recurso") {
  return NextResponse.json({ error: `${resource} não encontrado` }, { status: 404 })
}

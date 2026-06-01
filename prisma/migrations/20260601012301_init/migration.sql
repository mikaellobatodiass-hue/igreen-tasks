-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('DESENVOLVIMENTO', 'GESTAO', 'DOCUMENTACAO', 'REUNIAO', 'PESQUISA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('ALTA', 'MEDIA', 'BAIXA');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('A_FAZER', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EisenhowerQuadrant" AS ENUM ('Q1_URGENTE_IMPORTANTE', 'Q2_IMPORTANTE_NAO_URGENTE', 'Q3_URGENTE_NAO_IMPORTANTE', 'Q4_NAO_URGENTE_NAO_IMPORTANTE');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('TECNICA', 'LIDERANCA', 'INOVACAO', 'PROCESSO', 'COLABORACAO', 'RESULTADO_NEGOCIO');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('MUITO_BAIXO', 'BAIXO', 'MEDIO', 'ALTO', 'MUITO_ALTO');

-- CreateEnum
CREATE TYPE "DevelopmentPlanStatus" AS ENUM ('NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'PAUSADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" TEXT,
    "area" TEXT,
    "foto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" "TaskCategory" NOT NULL,
    "prioridade" "TaskPriority" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'A_FAZER',
    "quadranteEisenhower" "EisenhowerQuadrant",
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataEntrega" TIMESTAMP(3) NOT NULL,
    "dataConclusao" TIMESTAMP(3),
    "horasGastas" DOUBLE PRECISION,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "evidencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" "AchievementCategory" NOT NULL,
    "impacto" "ImpactLevel" NOT NULL,
    "dataConquista" TIMESTAMP(3) NOT NULL,
    "evidencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_plans" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" "DevelopmentPlanStatus" NOT NULL DEFAULT 'NAO_INICIADO',
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "prazo" TIMESTAMP(3) NOT NULL,
    "evidencia" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "development_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "tasks_userId_idx" ON "tasks"("userId");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_prioridade_idx" ON "tasks"("prioridade");

-- CreateIndex
CREATE INDEX "tasks_dataEntrega_idx" ON "tasks"("dataEntrega");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_taskId_key" ON "achievements"("taskId");

-- CreateIndex
CREATE INDEX "achievements_userId_idx" ON "achievements"("userId");

-- CreateIndex
CREATE INDEX "achievements_dataConquista_idx" ON "achievements"("dataConquista");

-- CreateIndex
CREATE INDEX "development_plans_userId_idx" ON "development_plans"("userId");

-- CreateIndex
CREATE INDEX "development_plans_status_idx" ON "development_plans"("status");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

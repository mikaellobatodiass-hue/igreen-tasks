# iGreen Tasks

Sistema web de gestão de demandas profissionais e acompanhamento de produtividade.

> Organize. Priorize. Evolua.

---

## Funcionalidades

- **Dashboard** — KPIs em tempo real, produtividade semanal e conquistas recentes
- **Gestão de Demandas** — CRUD completo com filtros, busca e controle de horas
- **Matriz de Eisenhower** — Priorização visual com drag & drop nos 4 quadrantes
- **Conquistas Profissionais** — Timeline de entregas com categorias e impacto
- **Plano de Desenvolvimento** — Metas com barra de progresso e prazo
- **Relatórios** — Análise por período com gráficos e distribuição por categoria
- **Perfil** — Informações profissionais e cargo

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 + shadcn/ui |
| Banco de dados | PostgreSQL 17 |
| ORM | Prisma 7 |
| Autenticação | NextAuth v5 (credentials) |
| Estado | TanStack Query v5 |
| Validação | Zod v4 |
| Gráficos | Recharts |
| Drag and Drop | @dnd-kit |

---

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/igreen-tasks.git
cd igreen-tasks
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env`:

```env
DATABASE_URL="postgresql://igreen:igreen_secret@localhost:5435/igreen_tasks?schema=public"
AUTH_SECRET="gere-com-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Suba o banco de dados

```bash
docker compose up -d
```

### 5. Execute as migrações e o seed

```bash
npm run db:migrate
npm run db:seed
```

Credenciais criadas pelo seed:

| Campo | Valor |
|---|---|
| E-mail | `mikaellobatodiass@gmail.com` |
| Senha | `igreen@2026` |

### 6. Inicie o servidor

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento (Turbopack)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting

npm run db:migrate   # Aplicar migrações Prisma
npm run db:generate  # Regenerar Prisma client
npm run db:seed      # Popular banco com usuário inicial
npm run db:studio    # Abrir Prisma Studio (UI do banco)
npm run db:reset     # Resetar banco e re-aplicar seed
```

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/login/          # Tela de login (pública)
│   ├── (dashboard)/           # Layout protegido + páginas
│   └── api/                   # Route Handlers REST
├── components/
│   ├── layout/                # Sidebar e Topbar
│   ├── tasks/                 # Formulário de demandas
│   └── ui/                    # Componentes shadcn/ui
├── hooks/                     # React Query hooks por domínio
├── lib/                       # Prisma, Auth, api-client, helpers
├── repositories/              # Camada de acesso ao banco
├── services/                  # Regras de negócio
├── types/                     # Tipos TypeScript
└── validations/               # Schemas Zod
```

---

## API

Todas as rotas exigem sessão autenticada (JWT).

| Método | Rota | Descrição |
|---|---|---|
| GET / POST | `/api/tasks` | Listar / criar demandas |
| GET / PATCH / DELETE | `/api/tasks/:id` | Detalhes / editar / excluir |
| POST | `/api/tasks/:id/complete` | Concluir demanda com horas |
| GET | `/api/tasks/eisenhower` | Board da Matriz Eisenhower |
| GET / POST | `/api/achievements` | Listar / criar conquistas |
| GET / PATCH / DELETE | `/api/achievements/:id` | Detalhes / editar / excluir |
| GET / POST | `/api/development-plans` | Planos de desenvolvimento |
| GET / PATCH / DELETE | `/api/development-plans/:id` | Detalhes / editar / excluir |
| GET | `/api/reports` | Dashboard e relatórios por período |
| GET / PATCH | `/api/profile` | Perfil do usuário |

---

## Arquitetura

```
Route Handler → Service → Repository → Prisma → PostgreSQL
```

O middleware do Next.js protege todas as rotas autenticadas e redireciona para `/login` quando não há sessão ativa.

---

## Deploy (Vercel)

1. Conecte o repositório no [vercel.com](https://vercel.com)
2. Configure as variáveis de ambiente no painel
3. Use um PostgreSQL externo (Neon, Supabase ou Railway)

Variáveis obrigatórias em produção:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

Após o deploy, execute as migrações:

```bash
npx prisma migrate deploy
```

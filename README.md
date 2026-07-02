# Fotografando Olhares

Plataforma para cadastro de pacientes, acompanhamento de laudos de retinografia e relatorios de triagens oftalmologicas.

Hoje o app atende a Liga de Oftalmologia da PUC. O roadmap do produto esta em [docs/roadmap.md](docs/roadmap.md), com a evolucao para suporte multi-instituicao, esteira clinica, imagens de exame, laudos em PDF e auditoria/LGPD.

## Architecture

The source tree follows the `app/features/shared` structure documented in [docs/architecture.md](docs/architecture.md):

- `src/app`: Next.js routes and layouts.
- `src/features`: business modules.
- `src/shared`: reusable UI, hooks, libraries, services and shared domain types.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

To run on the development port used in this workspace:

```bash
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the app.

## Database migrations

SQL migrations live in `supabase/migrations`.

The first productization migration is:

```text
supabase/migrations/20260702161000_add_organizations.sql
```

Apply it in Supabase before wiring the application queries to `organization_id`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

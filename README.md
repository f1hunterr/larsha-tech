# Larsha Tech

Company website for **Larsha Tech** — an IT services business in Bangalore offering computer repair and professional web development.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4, Framer Motion |
| Routing | Wouter |
| UI | Radix UI |
| Backend | Express 5, Node.js 24 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod |
| Package manager | pnpm workspaces |
| Language | TypeScript 5.9 |

## Project structure

```
artifacts/
  larsha-tech/      # React frontend (the website)
  api-server/       # Express backend API
  mockup-sandbox/   # UI prototyping sandbox
lib/
  db/               # Drizzle ORM schema + migrations
  api-spec/         # OpenAPI YAML + Orval codegen config
  api-client-react/ # Auto-generated typed API client
  api-zod/          # Zod validation schemas
```

## Development

> Requires Linux or WSL. The lockfile contains Linux-only native binaries.

```bash
# Install dependencies
pnpm install

# Run the frontend (requires PORT and BASE_PATH env vars)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/larsha-tech run dev

# Run the backend (requires DATABASE_URL env var)
DATABASE_URL=postgres://... pnpm --filter @workspace/api-server run dev

# Type-check all packages
pnpm run typecheck

# Build everything
PORT=3000 BASE_PATH=/ pnpm run build
```

## Database

```bash
# Push schema changes to the database
DATABASE_URL=postgres://... pnpm --filter @workspace/db run push

# Regenerate API client from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

## CI

GitHub Actions runs typecheck and a full build on every push and pull request to `main`. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Deployment

Production deployment uses Docker. See the Docker setup (coming soon).

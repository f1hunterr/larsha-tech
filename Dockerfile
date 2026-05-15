# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:24-slim AS builder

# better-sqlite3 (server workspace) is a native C++ addon — needs build tools
# even in the frontend build stage because pnpm installs the whole monorepo
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

ENV PORT=3000 BASE_PATH=/ NODE_ENV=production

RUN pnpm --filter @workspace/larsha-tech run build

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/artifacts/larsha-tech/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

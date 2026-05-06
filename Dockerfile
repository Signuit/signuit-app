# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS base

RUN npm install -g pnpm@10.5.2

WORKDIR /app

################################################################################
# Stage 1: Build
################################################################################
FROM base AS builder

COPY . .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

RUN pnpm --filter=@nexus/web build

# pnpm deploy: sadece production node_modules üretir (source veya .output değil)
RUN pnpm deploy --filter=@nexus/web --prod --legacy /prod/web

################################################################################
# Stage 2: Runner
################################################################################
FROM node:${NODE_VERSION}-slim AS runner

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs appuser

# Nitro bundle (.output) — builder stage'den doğrudan al
COPY --from=builder --chown=appuser:nodejs /app/apps/web/.output ./apps/web/.output

# pnpm deploy çıktısı: Daml gibi external dep'ler için production node_modules
COPY --from=builder --chown=appuser:nodejs /prod/web/node_modules ./apps/web/node_modules

USER appuser

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

WORKDIR /app/apps/web
CMD ["node", ".output/server/index.mjs"]

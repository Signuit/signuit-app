# syntax=docker/dockerfile:1

###############################################################################
# SignUIT Web App — Production Dockerfile
###############################################################################

ARG NODE_VERSION=20

###############################################################################
# Base — shared tooling
###############################################################################
FROM node:${NODE_VERSION}-slim AS base
RUN npm install -g pnpm@10.5.2
WORKDIR /app

###############################################################################
# Builder — Full build inside Docker (ensures Linux native bindings)
###############################################################################
FROM base AS builder

# Copy manifests for caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/
COPY framework/ ./framework/
COPY sandbox/daml.js/ ./sandbox/daml.js/

# Install dependencies + rebuild native binaries for Linux
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile && \
    pnpm rebuild lightningcss esbuild 2>/dev/null || true

# Copy full source
COPY . .

# Build the web app
# Nitro/Vite will build specifically for this Linux target
RUN NODE_OPTIONS="--max-old-space-size=8192" pnpm --filter=@nexus/web build

###############################################################################
# Runner — production image (minimal)
###############################################################################
FROM node:${NODE_VERSION}-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs appuser \
    && mkdir -p /data && chown appuser:nodejs /data

# Copy ONLY the built output from builder stage
COPY --from=builder --chown=appuser:nodejs /app/apps/web/.output ./apps/web/.output

# libsql native binary — ssr.external olduğu için .output/ içinde değil
# node_modules'dan dinamik require ile yükleniyor
COPY --from=builder --chown=appuser:nodejs /app/node_modules/.pnpm/libsql@0.3.19/node_modules/libsql ./node_modules/libsql
COPY --from=builder --chown=appuser:nodejs /app/node_modules/.pnpm/@libsql+client@0.14.0/node_modules/@libsql/client ./node_modules/@libsql/client
COPY --from=builder --chown=appuser:nodejs /app/node_modules/.pnpm/@libsql+core@0.14.0/node_modules/@libsql/core ./node_modules/@libsql/core

USER appuser

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

WORKDIR /app/apps/web
CMD ["node", ".output/server/index.mjs"]

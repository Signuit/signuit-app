# syntax=docker/dockerfile:1

###############################################################################
# SignUIT Web App — Production Dockerfile
# Multi-stage build for pnpm monorepo + TanStack Start (Nitro output)
###############################################################################

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS base

# Install pnpm
RUN npm install -g pnpm@9

WORKDIR /app

###############################################################################
# Stage 1: Build
###############################################################################
FROM base AS builder

# Copy entire monorepo (needed for workspace resolution)
COPY . .

# Install all deps including devDeps for build
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# Build the web app — outputs to apps/web/.output/
RUN pnpm --filter=@nexus/web build

###############################################################################
# Stage 2: Production runtime — minimal image
###############################################################################
FROM node:${NODE_VERSION}-slim AS runner

# curl for healthchecks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs appuser

# Copy only the built Nitro output (self-contained bundle)
COPY --from=builder --chown=appuser:nodejs /app/apps/web/.output ./apps/web/.output

USER appuser

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

WORKDIR /app/apps/web
CMD ["node", ".output/server/index.mjs"]

# Builder
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/grind-buddy/package.json apps/grind-buddy/
COPY packages/auth/package.json packages/auth/
COPY packages/db/package.json packages/db/

RUN pnpm install --frozen-lockfile

COPY apps/grind-buddy ./apps/grind-buddy
COPY packages/auth ./packages/auth
COPY packages/db ./packages/db

WORKDIR /app/apps/grind-buddy
RUN pnpm run build

# Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable

# Copy monorepo configs and lockfile
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json /app/turbo.json ./

# Copy package.json files for all packages
COPY --from=builder /app/apps/grind-buddy/package.json ./apps/grind-buddy/
COPY --from=builder /app/packages/auth/package.json ./packages/auth/
COPY --from=builder /app/packages/db/package.json ./packages/db/

# Install dependencies (needed for both dev and production)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --from=builder /app/apps/grind-buddy ./apps/grind-buddy
COPY --from=builder /app/packages/auth ./packages/auth
COPY --from=builder /app/packages/db ./packages/db

WORKDIR /app/apps/grind-buddy

ENV PORT=4173
ENV HOST=0.0.0.0
EXPOSE 4173

# Default to dev mode (can be overridden in docker-compose.yml)
# Vite respects PORT and HOST environment variables
CMD ["pnpm", "run", "dev"]


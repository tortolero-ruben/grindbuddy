# Build stage - use shared base
FROM ghcr.io/tortolero-ruben/monorepo/monorepo-base:latest AS builder

WORKDIR /app

# Copy source code (dependencies already in base image)
COPY packages ./packages
COPY apps/grind-buddy ./apps/grind-buddy

# Set up workspace symlinks (dependencies already downloaded, just link them)
RUN pnpm install --frozen-lockfile=false

# Build environment
ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Build the application
RUN pnpm --filter=grind-buddy build

# Production stage - use shared production base
FROM ghcr.io/tortolero-ruben/monorepo/monorepo-base:prod AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 sveltekit

USER sveltekit

# Copy built app only
COPY --from=builder --chown=sveltekit:nodejs /app/apps/grind-buddy/.svelte-kit/output/server ./app

# Copy all production dependencies (already optimized in base image)
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules ./node_modules

ENV PORT=3000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "app/index.js"]

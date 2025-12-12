# Builder stage
FROM node:20-alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

# Enable corepack for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

# Copy package files first for dependency installation
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY .npmrc ./.npmrc

# Copy workspace manifests for dependency installation (keeps install layer cacheable)
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY apps/grind-buddy/package.json ./apps/grind-buddy/

# Install dependencies for the entire workspace (cacheable)
RUN pnpm install --frozen-lockfile

# Now copy the source code
COPY packages ./packages
COPY apps ./apps

# Build the application
# We need to set the environment variables that are used at build time by the adapter
# Note: In a real CI/CD, these might be passed differently, but for self-contained builds this works.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV AUTH_SECRET="dummy_secret_for_build_process_only_32_chars"
ENV AUTH_URL="http://localhost:3000"
ENV AUTH_TRUST_HOST="true"
ENV NODE_ENV=production

# Run the build for the specific app
RUN pnpm --filter=grind-buddy build

# Deploy the pruned production dependencies and built artifacts to a specific directory
# This command isolates the package and its prod dependencies
RUN pnpm --filter=grind-buddy --prod deploy pruned

# Also copy migration files and db package source for running migrations
RUN mkdir -p /app/packages/db/drizzle && \
    cp -r packages/db/drizzle/* /app/packages/db/drizzle/ 2>/dev/null || true && \
    cp -r packages/db/src /app/packages/db/ && \
    cp packages/db/package.json /app/packages/db/ && \
    cp packages/db/drizzle.config.ts /app/packages/db/ 2>/dev/null || true

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

USER sveltekit

# Copy the pruned deployment from the builder
COPY --from=builder --chown=sveltekit:nodejs /app/pruned .
COPY --from=builder --chown=sveltekit:nodejs /app/apps/grind-buddy/build ./build
# Copy migration files and db package
COPY --from=builder --chown=sveltekit:nodejs /app/packages ./packages

ENV PORT=5173
ENV HOST=0.0.0.0
ENV NODE_ENV=production
EXPOSE 5173

# Migration script should already be copied from packages directory above (line 57)
# This line is kept for reference but the file should already exist

CMD ["node", "build"]

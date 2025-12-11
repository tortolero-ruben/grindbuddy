# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# Copy monorepo configs
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy package.json files
COPY apps/grind-buddy/package.json apps/grind-buddy/
COPY packages/auth/package.json packages/auth/
COPY packages/db/package.json packages/db/

# Install dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/grind-buddy ./apps/grind-buddy
COPY packages/auth ./packages/auth
COPY packages/db ./packages/db

# Build the application
WORKDIR /app/apps/grind-buddy
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    AUTH_SECRET="dummy_secret_for_build_process_only_32_chars" \
    AUTH_URL="http://localhost:3000" \
    pnpm run build

# Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built application and dependencies
# adapter-node builds into a standalone 'build' directory (or configured out dir)
# We need to copy that and the node_modules needed for production
# However, adapter-node usually bundles everything needed into the build output 
# or relies on the host having the dependencies. 
# A cleaner approach with pnpm in monorepo is to install prod deps in a separate stage 
# or Prune, but adapter-node often simplifies this by outputting a server that just needs 'node build'
# Let's check if the user's build output is 'build' (default for adapter-node).

# Copy the build output from the builder stage
COPY --from=builder /app/apps/grind-buddy/build ./build
COPY --from=builder /app/apps/grind-buddy/package.json ./package.json

# If adapter-node is configured to NOT bundle deps (default), we need to install prod deps.
# But in a monorepo, that's tricky without copying the whole workspace structure again.
# A common strategy with adapter-node is to copy the standalone output if configured, 
# or just run from the build folder if we install deps.
# To keep it robust, let's assume we need to install production dependencies.

# Actually, the simplest 'adapter-node' deployment is:
# 1. Build
# 2. Copy 'build' folder
# 3. Running 'node build'
# But 'node build' requires 'node_modules' unless we bundle.
# Let's inspect the build output later if needed, but for now we will rely on installing prod deps.
# Using 'pnpm deploy' is also an option but let's stick to standard copy.

# Let's try to do a clean install of prod dependencies for the specific app
# This might be hard in a monorepo structure without all packages.
# ALTERNATIVE: Copy the entire necessary node_modules from builder? No, that has dev deps.

# Let's go with a pragmatic approach:
# Copy the built artifacts and the monorepo structure needed to install prod deps.

RUN corepack enable

COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json /app/turbo.json ./
COPY --from=builder /app/apps/grind-buddy/package.json ./apps/grind-buddy/
COPY --from=builder /app/packages/auth/package.json ./packages/auth/
COPY --from=builder /app/packages/db/package.json ./packages/db/

RUN pnpm install --prod --frozen-lockfile

# Copy the build output
COPY --from=builder /app/apps/grind-buddy/build ./apps/grind-buddy/build

WORKDIR /app/apps/grind-buddy

ENV PORT=3000
EXPOSE 3000

CMD ["node", "build"]

# Optimized Multi-stage Dockerfile for MimiSalon Monorepo with supervisord
# Uses Next.js standalone mode for minimal image size

# ============================================================================
# Stage 1: Base dependencies
# ============================================================================
FROM oven/bun:1-alpine AS deps
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++
WORKDIR /app

# Copy package files (root + packages)
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies WITHOUT scripts (faster, no native compilation hangs)
RUN bun install --frozen-lockfile --ignore-scripts --force

# ============================================================================
# Stage 2: Builder
# ============================================================================
FROM oven/bun:1-alpine AS builder
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++
WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Install shared package dependencies in builder
RUN bun install --frozen-lockfile --ignore-scripts

# Generate Prisma client and build Shared package
RUN bun run --cwd packages/shared db:generate
RUN bun run --cwd packages/shared build

# Build Next.js application with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1

# Accept build-time public environment variables (BEFORE build)
# These are baked into the browser JavaScript bundle at build time
ARG NEXT_PUBLIC_BETTER_AUTH_URL
#ARG NEXT_PUBLIC_PORTONE_CHANNEL_KEY
#ARG NEXT_PUBLIC_PORTONE_STORE_ID
#ARG NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE
#ARG NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL
#ARG NEXT_PUBLIC_KAKAO_MAP_KEY

# Set as ENV so Next.js build can access them
ENV NEXT_PUBLIC_BETTER_AUTH_URL=$NEXT_PUBLIC_BETTER_AUTH_URL
#ENV NEXT_PUBLIC_PORTONE_CHANNEL_KEY=$NEXT_PUBLIC_PORTONE_CHANNEL_KEY
#ENV NEXT_PUBLIC_PORTONE_STORE_ID=$NEXT_PUBLIC_PORTONE_STORE_ID
#ENV NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE=$NEXT_PUBLIC_CUSTOMER_SERVICE_PHONE
#ENV NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL=$NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL
#ENV NEXT_PUBLIC_KAKAO_MAP_KEY=$NEXT_PUBLIC_KAKAO_MAP_KEY

# Now build with variables available
RUN bun run build

# ============================================================================
# Stage 3: Runner (Production)
# ============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache libc6-compat supervisor

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 mimisalon

# ============================================================================
# Copy Next.js standalone build
# ============================================================================
# The standalone folder has all necessary dependencies
COPY --from=builder --chown=mimisalon:nodejs /app/.next/standalone ./
COPY --from=builder --chown=mimisalon:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=mimisalon:nodejs /app/public ./public

# ============================================================================
# Copy workspace structure
# ============================================================================
# Copy root node_modules and workspace files
COPY --from=builder --chown=mimisalon:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=mimisalon:nodejs /app/package.json ./package.json
COPY --from=builder --chown=mimisalon:nodejs /app/bun.lock ./bun.lock

# ============================================================================
# Copy Shared package files
# ============================================================================
# Create packages directory structure
RUN mkdir -p packages/shared

# Copy Shared package (compiled dist and Prisma schema)
COPY --from=builder --chown=mimisalon:nodejs /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=mimisalon:nodejs /app/packages/shared/prisma ./packages/shared/prisma
COPY --from=builder --chown=mimisalon:nodejs /app/packages/shared/package.json ./packages/shared/package.json

# ============================================================================
# Copy supervisord configuration
# ============================================================================
COPY --from=builder --chown=mimisalon:nodejs /app/supervisord.conf ./

# ============================================================================
# Environment configuration
# ============================================================================
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Default ports (can be overridden)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Switch to non-root user
USER mimisalon

# Expose port for Next.js
EXPOSE 3000

# Health check for Next.js service
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start supervisord
# supervisord runs as PID 1 and properly handles SIGTERM for graceful shutdown
# Note: Database migrations are now handled in GitHub Actions before deployment
CMD ["supervisord", "-c", "supervisord.conf"]

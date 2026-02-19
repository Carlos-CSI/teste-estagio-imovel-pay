# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:24-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript (app)
RUN npm run build

# Compile seed script separately (lives in prisma/, outside src rootDir)
RUN npx tsc -p tsconfig.seed.json

# ── Stage 2: production ───────────────────────────────────────────────────────
FROM node:24-slim

WORKDIR /app

# Install OpenSSL and libssl3 explicitly (required by Prisma engine binaries)
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl libssl3 \
  && rm -rf /var/lib/apt/lists/*

# Copy package manifests so Prisma can locate the CLI via npx
COPY package*.json ./

# Copy full node_modules from builder (includes prisma CLI and devDeps)
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema + migrations
COPY prisma ./prisma

# Copy seed tsconfig (needed for locating compiled output path reference only)
COPY tsconfig.seed.json ./

# Re-run prisma generate in THIS stage so the migration engine binary
# is downloaded for the exact OS/OpenSSL version of the production image
RUN npx prisma generate

# Copy compiled build output
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

# 1. Sync schema to DB
# 2. Run seed (idempotent: skips if data already exists)
# 3. Start server
CMD ["sh", "-c", "npx prisma db push && node dist/seed.js && node dist/main.js"]

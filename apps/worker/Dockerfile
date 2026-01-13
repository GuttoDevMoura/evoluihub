# ---------- BASE ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- DEPENDÊNCIAS ----------
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/worker/package.json apps/worker/package.json
COPY packages ./packages
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
RUN pnpm install --filter worker...

# ---------- BUILD ----------
FROM deps AS build
COPY . .
RUN pnpm --filter worker build

# ---------- RUNTIME ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/worker ./apps/worker
COPY --from=build /app/packages ./packages
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

CMD ["node", "apps/worker/dist/index.js"]

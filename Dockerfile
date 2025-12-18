# check=skip=SecretsUsedInArgOrEnv
# syntax=docker.io/docker/dockerfile:1

FROM node:22.21.0-alpine AS base

# install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# make build-time env vars available
ARG DATABASE_URI
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET

ENV DATABASE_URI=$DATABASE_URI
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 nextjs

# remove this line if this folder does not exist
COPY --from=builder /app/public ./public

# set the correct permission for prerender cache
RUN mkdir .next

RUN chown nextjs:nodejs .next

# automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

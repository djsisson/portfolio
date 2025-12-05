FROM node:24-alpine AS base

ARG YARN_VERSION=4.12
RUN corepack enable && corepack prepare yarn@${YARN_VERSION} --activate
RUN yarn set version ${YARN_VERSION}
RUN apk add --no-cache libc6-compat curl

FROM base AS deps

USER node

WORKDIR /app
ENV NODE_ENV=production

# Install dependencies based on the preferred package manager
COPY --chown=node:node package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .yarnrc.yml* ./

USER root

# Yarn
RUN --mount=type=cache,target=/root/.cache/yarn \
  if [ -f yarn.lock ]; then yarn install --immutable; fi

# npm
RUN --mount=type=cache,target=/root/.npm \
  if [ -f package-lock.json ]; then npm ci; fi

# pnpm
RUN --mount=type=cache,target=/root/.pnpm-store \
  if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; fi

# Rebuild the source code only when needed

FROM base AS builder
WORKDIR /app

COPY --from=deps --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

USER root

RUN  --mount=type=cache,target=/app/.next/cache \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3001
ENV PORT=3001
USER nextjs
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

ARG IMAGE=node:24

FROM $IMAGE AS development

ENV TZ="Europe/Warsaw"

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app/.pnpm-store && \
    chown -R node:node /usr/src/app && \
    chown -R node:node /usr/src/app/.pnpm-store

USER node
WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./
COPY --chown=node:node . .

FROM $IMAGE AS builder

ENV NODE_ENV=production
ENV CI=true

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json .
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
RUN npm prune --prod

USER node

FROM $IMAGE AS production

ENV NODE_ENV=production

ENV TZ="Europe/Warsaw"

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY --chown=node:node ./package*.json ./ 
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
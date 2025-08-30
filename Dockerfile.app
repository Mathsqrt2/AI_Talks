ARG IMAGE=node:24

FROM $IMAGE AS base

ENV TZ="Europe/Warsaw"

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

FROM base AS prod-base 

ENV NODE_ENV=production

ENV CI=true

FROM base AS development

COPY --chown=node:node ./package*.json ./

COPY --chown=node:node . .

USER node

FROM base AS frontend

COPY --chown=node:node ./frontend/package*.json ./

RUN npm ci

COPY --chown=node:node ./frontend .

USER node

FROM base AS builder

COPY --chown=node:node ./package*.json .

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

RUN npm prune --prod

USER node

FROM base AS frontend-builder

COPY --chown=node:node ./frontend/package*.json ./

RUN npm install

COPY --chown=node:node ./frontend .

RUN npm run build

RUN npm prune --prod

USER node

FROM prod-base AS production

COPY --chown=node:node ./package*.json ./ 

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules

COPY --chown=node:node --from=builder /usr/src/app/modelfiles ./modelfiles

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

COPY --chown=node:node --from=frontend-builder /usr/src/app/dist ./frontend/dist
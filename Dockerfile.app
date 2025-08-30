ARG IMAGE=node:24

FROM $IMAGE AS base

ENV TZ="Europe/Warsaw"

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

FROM base AS development

COPY --chown=node:node ./package*.json ./

RUN mkdir -p /usr/src/app/node_modules && \
    chown -R node:node /usr/src/app/node_modules

RUN npm install --package-lock-only && npm ci

COPY --chown=node:node . .

FROM base AS frontend-development

COPY --chown=node:node ./frontend/package*.json ./

RUN mkdir -p /usr/src/app/node_modules && \
    chown -R node:node /usr/src/app/node_modules

RUN npm install --package-lock-only && npm ci

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

FROM base AS production

ENV NODE_ENV=production

ENV CI=true

COPY --chown=node:node ./package*.json ./ 

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules

COPY --chown=node:node --from=builder /usr/src/app/modelfiles ./modelfiles

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

COPY --chown=node:node --from=frontend-builder /usr/src/app/dist ./frontend/dist

USER node
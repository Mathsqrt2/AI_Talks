ARG IMAGE=node:22

FROM $IMAGE AS builder

WORKDIR /app

COPY . .

RUN npm install

FROM builder AS dev

CMD [""]

FROM builder AS prod-build

RUN npm run build

RUN npm prune --production

FROM $IMAGE AS prod

COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
COPY --chown=node:node --from=prod-build /app/.env /app/.env

ENV NODE_ENV=production

ENTRYPOINT [ "node", "./main.js" ]

WORKDIR /app/dist

CMD [""]

USER node

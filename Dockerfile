FROM hub.upat.agetic.gob.bo/dockerhub-proxy/library/node:14-alpine AS build
RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/app/aprobaciones && mkdir -p /home/node/app/documentos_soporte && chown -R node:node /home/node/app && chown -R node:node  /home/node/app/documentos_soporte && chown -R node:node  /home/node/app/aprobaciones
WORKDIR /home/node/app
# RUN chown -R node.node /home/node/app
COPY --chown=node:node . .

COPY --chown=node:node node_modules ./node_modules
COPY --chown=node:node dist ./dist

USER node
ARG CI_COMMIT_SHORT_SHA
ARG CI_COMMIT_MESSAGE
ARG CI_COMMIT_REF_NAME
ENV CI_COMMIT_SHORT_SHA=${CI_COMMIT_SHORT_SHA} \
    CI_COMMIT_MESSAGE=${CI_COMMIT_MESSAGE} \
    CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME}
RUN npm set registry http://repositorio.agetic.gob.bo/nexus/repository/npmjs
RUN npm set strict-ssl false
# RUN npm ci
# RUN npm run build


FROM build AS production
WORKDIR /home/node/app
# COPY --from=build --chown=node:node /home/node/app/dist .
USER node
CMD ["sh", "-c",  "node /home/node/app/dist/src/main.js"]
EXPOSE 3000

FROM build AS sandbox
WORKDIR /home/node/app
USER node
CMD  ["sh", "-c",  "node /home/node/app/dist/src/main.js"]
EXPOSE 3000


FROM build AS testing
WORKDIR /home/node/app
USER node
CMD ["sh", "-c",  "node /home/node/app/dist/src/main.js"]
EXPOSE 3000

FROM build AS development
WORKDIR /home/node/app
USER node
CMD ["npm", "run","/home/node/app/dist/src/main.js"]
EXPOSE 3000

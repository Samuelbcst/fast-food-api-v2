#Dockerfile
FROM node:23-slim

WORKDIR /

ENV NODE_ENV=production

COPY ./package.json ./yarn.lock /
COPY ./dist/src /dist
COPY ./src/.env /dist/.env

RUN yarn install --production --frozen-lockfile

EXPOSE 3000

CMD ["sh", "-c", "ls database-tools && yarn migration:docker:run && yarn start"]

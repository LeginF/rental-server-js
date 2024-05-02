FROM node:slim

ENV PORT=8080
ENV NODE_ENV development

WORKDIR /express-docker

COPY . .

RUN npm install

EXPOSE 5050

CMD [ "node", "server" ]


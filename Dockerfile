FROM node:14-alpine

ENV PORT 3000
ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["node", "index.js"]

FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN npx prisma generate

RUN yarn run build

CMD ["yarn", "run", "start:prod"]

EXPOSE 4000

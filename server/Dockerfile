#Dependências
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

#Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

COPY .env .env

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

#Running
FROM node:20-alpine AS runner

WORKDIR /usr/app

COPY --from=builder /app/build ./build

COPY package.json ./

COPY .env .env

RUN npm install --production

USER node

EXPOSE 3333

CMD ["npm", "start"]
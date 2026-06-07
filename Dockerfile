FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG BUILD_SCRIPT
RUN pnpm run $BUILD_SCRIPT

EXPOSE 3000

CMD ["pnpm", "start"]
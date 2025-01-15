FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY packages/main-db packages/main-db
COPY apps/api apps/api

RUN bun install --filter="@devobank/api" --production

ENV NODE_ENV production
CMD ["bun", "apps/api/src/index.ts"]

EXPOSE 3000
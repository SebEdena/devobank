FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY packages/main-db packages/main-db
COPY packages/event-bus packages/event-bus
COPY apps/api apps/api

RUN bun install --filter="@devobank/api"

ENV NODE_ENV production
CMD ["bun", "run", "--watch", "apps/api/src/index.ts"]

EXPOSE 3000
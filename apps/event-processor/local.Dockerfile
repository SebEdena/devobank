FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY packages/event-bus packages/event-bus
COPY apps/event-processor apps/event-processor

RUN bun install --filter="@devobank/event-processor"

ENV NODE_ENV production
CMD ["bun", "run", "--watch", "apps/event-processor/src/index.ts"]
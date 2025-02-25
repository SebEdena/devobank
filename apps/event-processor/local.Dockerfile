FROM node:22-slim AS base
RUN npm install -g pnpm@latest

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm deploy --filter=@devobank/event-processor event-processor

FROM base AS event-processor
WORKDIR /app
COPY --from=build /app/event-processor .
CMD ["pnpm", "run", "dev"]
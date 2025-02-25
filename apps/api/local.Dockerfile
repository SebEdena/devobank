FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm deploy --filter @devobank/api ./api

FROM base AS api
WORKDIR /app
COPY --from=build /app/api .
CMD ["pnpm", "run", "dev"]

EXPOSE 8080
EXPOSE 6499
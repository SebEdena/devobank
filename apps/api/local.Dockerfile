FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

FROM base AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm deploy --filter @devobank/api build/api

FROM base AS api
WORKDIR /app
COPY --from=build /app/build/api .
CMD ["pnpm", "run", "dev"]

EXPOSE 8080
EXPOSE 6499
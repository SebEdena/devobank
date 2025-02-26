FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=${PNPM_HOME} \
    pnpm config set store-dir ${PNPM_HOME} && \ 
    pnpm install --frozen-lockfile

FROM build AS api
WORKDIR /app
CMD ["pnpm", "run", "--filter", "@devobank/api", "dev"]

FROM build AS event-processor
WORKDIR /app
CMD ["pnpm", "run", "--filter", "@devobank/event-processor", "dev"]
import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Config = Type.Object({
  ENV: Type.String({ default: "local" }),
  MQ_EVENT_QUEUE: Type.String({ default: "event-queue" }),
});

export type Config = Static<typeof Config>;

export const config = {
  MQ_EVENT_QUEUE: "events",
  MQ_HOST: process.env.MQ_HOST || "localhost",
  MQ_PORT: 5672,
  MQ_USER: "guest",
  MQ_PASSWORD: "guest",
  READ_DB: {
    host: process.env.PG_HOST_READ || "localhost",
    port: 5433,
    database: "devobank-read",
    user: "devobank",
    password: "devobank",
  },
};

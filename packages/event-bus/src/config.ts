import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Config = Type.Object({
  ENV: Type.String({ default: "local" }),
  MQ_HOST: Type.String({ default: "localhost" }),
  MQ_USER: Type.String({ default: "admin" }),
  MQ_PASSWORD: Type.String({ default: "admin" }),
  MQ_EVENT_QUEUE: Type.String({ default: "event-queue" }),
  MQ_EXCHANGE: Type.String({ default: "event-exchange" }),
});

export type Config = Static<typeof Config>;

export const config = Value.Parse(Config, process.env);

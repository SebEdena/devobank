import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Config = Type.Object({
  ENV: Type.String({ default: "local" }),
  PG_HOST_READ: Type.String({ default: "localhost" }),
  PG_PORT_READ: Type.Number({ default: 5433 }),
  PG_USER_READ: Type.String({ default: "devobank" }),
  PG_PASSWORD_READ: Type.String({ default: "devobank" }),
  PG_DATABASE_READ: Type.String({ default: "devobank-read" }),
});

export type Config = Static<typeof Config>;

export const config = Value.Parse(Config, process.env);

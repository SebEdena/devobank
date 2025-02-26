import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Config = Type.Object({
  ENV: Type.String({ default: "local" }),
  PG_HOST_MAIN: Type.String({ default: "localhost" }),
  PG_PORT_MAIN: Type.Number({ default: 5432 }),
  PG_USER_MAIN: Type.String({ default: "devobank" }),
  PG_PASSWORD_MAIN: Type.String({ default: "devobank" }),
  PG_DATABASE_MAIN: Type.String({ default: "devobank-main" }),
});

export type Config = Static<typeof Config>;

export const config = Value.Parse(Config, process.env);

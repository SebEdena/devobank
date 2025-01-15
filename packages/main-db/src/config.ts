import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Config = Type.Object({
  ENV: Type.String({ default: "local" }),
  PG_HOST: Type.String({ default: "localhost" }),
  PG_PORT: Type.Number({ default: 5432 }),
  PG_USER: Type.String({ default: "devobank" }),
  PG_PASSWORD: Type.String({ default: "devobank" }),
  PG_DATABASE: Type.String({ default: "devobank-main" }),
});

export type Config = Static<typeof Config>;

export const config = Value.Parse(Config, process.env);

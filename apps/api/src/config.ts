import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Config = Type.Object({
  ENV: Type.String({ default: "local" }),
});

export type Config = Static<typeof Config>;

export const config = Value.Parse(Config, process.env);

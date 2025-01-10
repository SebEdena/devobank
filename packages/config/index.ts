import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const Config = Type.Object({
  pg: Type.Object({
    host: Type.String({ default: "localhost" }),
    port: Type.Number({ default: 5432 }),
    user: Type.String({ default: "devobank" }),
    password: Type.String({ default: "devobank" }),
    database: Type.String({ default: "devobank-main" }),
    databaseRead: Type.String({ default: "devobank-read" }),
  }),
});

type Config = Static<typeof Config>;

export const config = Value.Parse(Config, {
  pg: {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    databaseRead: process.env.PG_DATABASE_READ,
  },
});

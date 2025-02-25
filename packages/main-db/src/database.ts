import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { config } from "./config";
import type { DB } from "./models";

export const dialect = new PostgresJSDialect({
  postgres: postgres({
    host: config.PG_HOST,
    port: config.PG_PORT,
    username: config.PG_USER,
    password: config.PG_PASSWORD,
    database: config.PG_DATABASE,
    debug: config.ENV === "local",
  }),
});

export const db = new Kysely<DB>({ dialect });

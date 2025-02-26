import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { config } from "./config";
import type { DB } from "./models";

export const dialect = new PostgresJSDialect({
  postgres: postgres({
    host: config.PG_HOST_MAIN,
    port: config.PG_PORT_MAIN,
    username: config.PG_USER_MAIN,
    password: config.PG_PASSWORD_MAIN,
    database: config.PG_DATABASE_MAIN,
    debug: config.ENV === "local",
  }),
});

export const db = new Kysely<DB>({ dialect });

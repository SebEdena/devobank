import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { config } from "./config";
import type { DB } from "./models";

export const dialect = new PostgresJSDialect({
  postgres: postgres({
    host: config.PG_HOST_READ,
    port: config.PG_PORT_READ,
    username: config.PG_USER_READ,
    password: config.PG_PASSWORD_READ,
    database: config.PG_DATABASE_READ,
    debug: config.ENV === "local",
  }),
});

export const db = new Kysely<DB>({ dialect });

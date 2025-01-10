import { config } from "@devobank/config";
import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "./models";

export const dialect = new PostgresJSDialect({
  postgres: postgres({
    host: config.pg.host,
    port: config.pg.port,
    database: config.pg.database,
    username: config.pg.user,
    password: config.pg.password,
  }),
});

export const db = new Kysely<DB>({ dialect });

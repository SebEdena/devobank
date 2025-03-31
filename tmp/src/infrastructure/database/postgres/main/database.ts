import { inject, injectable } from "inversify";
import type { Database } from "../../../../application/providers/database.interface";
import { container, TYPES } from "../../../../ioc";
import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "./models";

export const db = new Kysely<DB>({
  dialect: new PostgresJSDialect({
    postgres: postgres(container.get<string>(TYPES.mainDb)),
  }),
});

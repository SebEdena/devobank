import { inject, injectable } from "inversify";
import type { Database } from "../../../../application/providers/database.interface";
import { TYPES } from "../../../../ioc";
import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "./models";

@injectable()
export class PgMainDatabase implements Database<unknown> {
  @inject(TYPES.mainDb) private mainDb!: string;

  get instance() {
    return new Kysely<DB>({
      dialect: new PostgresJSDialect({
        postgres: postgres(this.mainDb),
      }),
    });
  }
}

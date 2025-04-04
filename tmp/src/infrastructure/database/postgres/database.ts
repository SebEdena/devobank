import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { Database } from "../../../application/providers/database.interface";

export abstract class PostgresDatabase<DB> implements Database<Kysely<DB>> {

    private readonly _db: Kysely<DB>;
    
    constructor(
      private readonly dbUrl: string,
    ) {
      this._db = this.createConnection(this.dbUrl);
    }

    private createConnection(dbUrl: string): Kysely<DB> {
        return new Kysely<DB>({
            dialect: new PostgresJSDialect({
                postgres: postgres(dbUrl),
            }),
        });
    }
  
    get instance() {
      return this._db;
    }
}
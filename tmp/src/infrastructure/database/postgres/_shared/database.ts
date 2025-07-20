import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { Database } from "@domain/ports/database.interface";

export abstract class PostgresDatabase<DB> implements Database {
  private readonly _db: Kysely<DB>;

  constructor(url: string, db?: Kysely<DB>) {
    this._db = db ?? this.createConnection(url);
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

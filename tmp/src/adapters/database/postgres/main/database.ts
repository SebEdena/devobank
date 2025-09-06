import { inject, injectable } from "inversify";
import { TYPES } from "@shared/ioc";
import { PostgresDatabase } from "../_shared/database";
import type { DB } from "./models";
import { config } from "@shared/config";
import type { Kysely } from "kysely";

@injectable()
export class PostgresDatabaseMain extends PostgresDatabase<DB> {
  constructor(db?: Kysely<DB>) {
    super(config.MAIN_DB_CONNECTION, db);
  }
}

import { config } from "@/config";
import { injectable } from "inversify";
import type { Kysely } from "kysely";
import { PostgresDatabase } from "../_shared/database";
import type { DB } from "./models";

@injectable()
export class PostgresDatabaseMain extends PostgresDatabase<DB> {
  constructor(db?: Kysely<DB>) {
    super(config.MAIN_DB_CONNECTION, db);
  }
}

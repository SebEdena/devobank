import { inject, injectable } from "inversify";
import { TYPES } from "../../../../ioc";
import { PostgresDatabase } from "../database";
import type { DB } from "./models";

@injectable()
export class PostgresDatabaseMain extends PostgresDatabase<DB> {
  constructor(@inject(TYPES.mainDb) dbUrl: string) {
    super(dbUrl);
  }
}

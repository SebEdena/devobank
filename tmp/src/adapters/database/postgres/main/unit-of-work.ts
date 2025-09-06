import type { Database, UnitOfWorkMain } from "@shared/ports/unit-of-work.interface";
import { PostgresDatabaseMain } from "./database";
import { PgUserRepository } from "./repositories/pg-user-repository";

export class PostgresUnitOfWorkMain implements UnitOfWorkMain {
  private readonly db = new PostgresDatabaseMain();
  private readonly _userRepository = new PgUserRepository(this.db);

  transaction<T>(operation: (db: Database) => T): Promise<T> {
    return this.db.instance.transaction().execute(async (trx) => {
      return await operation(new PostgresDatabaseMain(trx));
    });
  }

  get users() {
    return this._userRepository;
  }
}

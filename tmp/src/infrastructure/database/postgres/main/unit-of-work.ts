import type { Kysely } from "kysely";
import type { Database } from "../../../../application/providers/database.interface";
import { PostgresUnitOfWork } from "../unit-of-work";
import type { DB } from "./models";
import type { PgUserRepository } from "./repositories/pg-user-repository";

export class PostgresUnitOfWorkMain extends PostgresUnitOfWork<DB> {
  constructor(
    _db: Database<Kysely<DB>>,
    private readonly _userRepository: PgUserRepository,
  ) {
    super(_db);
  }

  transaction<T>(operation: (db: Kysely<DB>) => T): Promise<T> {
    return super._db.instance.transaction().execute(async (trx) => {
      return await operation(trx);
    });
  }

  get users() {
    return this._userRepository;
  }
}

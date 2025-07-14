import type { Database } from "@domain/adapters/database.interface";
import { PgUserRepository } from "./repositories/pg-user-repository";
import { PostgresDatabaseMain } from "./database";
import type { UnitOfWorkMain } from "@domain/adapters/unit-of-work.interface";

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


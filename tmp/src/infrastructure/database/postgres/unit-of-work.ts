import type { Kysely } from "kysely";
import type { Database } from "../../../application/providers/database.interface";
import type { UnitOfWork } from "../../../application/providers/unit-of-work.interface";

export abstract class PostgresUnitOfWork<DB> implements UnitOfWork<Kysely<DB>> {

    constructor(protected readonly _db: Database<Kysely<DB>>) {}

    transaction<T>(operation: (db: Kysely<DB>) => T): Promise<T> {
        return this._db.instance.transaction().execute(async (trx) => {
            return await operation(trx);
        });
    }
}
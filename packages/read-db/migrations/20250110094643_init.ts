import { type Kysely, sql } from "kysely";
import type { DB } from "../src/models";

export async function up(db: Kysely<DB>): Promise<void> {
  db.schema
    .createTable("read_users")
    .addColumn("id", "uuid", (c) => c.primaryKey().notNull())
    .addColumn("balance", "numeric(20, 2)", (c) => c.notNull().defaultTo(0))
    .execute();
}

import { type Kysely, sql } from "kysely";
import type { DB } from "../src/models";

export async function up(db: Kysely<DB>): Promise<void> {
  db.schema
    .createTable("users")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("email", "varchar(255)", (c) => c.unique().notNull())
    .addColumn("password", "varchar(255)", (c) => c.notNull())
    .execute();
}

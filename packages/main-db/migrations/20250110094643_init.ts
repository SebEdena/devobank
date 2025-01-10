import { CompiledQuery, type Kysely, sql } from "kysely";
import type { DB } from "../src/models";

export async function up(db: Kysely<DB>): Promise<void> {
  db.executeQuery(CompiledQuery.raw("CREATE EXTENSION IF NOT EXISTS pgcrypto;"));
  db.schema
    .createTable("users")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("email", "varchar(255)", (c) => c.unique().notNull())
    .execute();
}

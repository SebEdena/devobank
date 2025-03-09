import { type Kysely, sql } from "kysely";
import type { DB } from "../src/models";

export async function up(db: Kysely<DB>): Promise<void> {
  db.schema
    .createTable("users")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("email", "varchar(255)", (c) => c.unique().notNull())
    .addColumn("password", "varchar(255)", (c) => c.notNull())
    .execute();

  db.schema
    .createTable("transaction_types")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("name", "varchar(255)", (c) => c.unique().notNull())
    .execute();

  db.schema
    .createTable("transactions")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn("user_id", "uuid", (c) => c.references("users.id").notNull())
    .addColumn("transaction_type_id", "uuid", (c) => c.references("transaction_types.id").notNull())
    .addColumn("amount", "numeric(20, 2)", (c) => c.notNull())
    .execute();
}

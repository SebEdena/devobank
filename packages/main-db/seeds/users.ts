import type { Kysely } from "kysely";
import type { DB } from "../src/models";

export async function seed(db: Kysely<DB>): Promise<void> {
  await db
    .insertInto("users")
    .values({ email: "seb@devobank.com", password: Bun.password.hashSync("seb") })
    .execute();
}

import bcrypt from "bcrypt";
import type { Kysely } from "kysely";
import type { DB } from "../src/models";

export async function seed(db: Kysely<DB>): Promise<void> {
  await db
    .insertInto("users")
    .values({
      id: "55b45cda-1c86-47e4-a823-562a93d6b1e9",
      email: "seb@devobank.com",
      password: bcrypt.hashSync("seb", 10),
    })
    .execute();
}

import type { Kysely } from "kysely";
import type { DB } from "../src/models";

export async function seed(db: Kysely<DB>): Promise<void> {
  await db
    .insertInto("transaction_types")
    .values([
      {
        name: "Salary",
      },
      {
        name: "Rent",
      },
      {
        name: "Groceries",
      },
      {
        name: "Entertainment",
      },
      {
        name: "Transport",
      },
      {
        name: "Health",
      },
      {
        name: "Travel",
      },
      {
        name: "Transfer",
      },
    ])
    .execute();
}

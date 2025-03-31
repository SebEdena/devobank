import type { Kysely } from "kysely";
import { PgMainDatabase } from "../database";
import type { DB } from "../models";
import type { UserRepository } from "../../../../../application/repositories/user-repository.interface";
import type { Database } from "../../../../../application/providers/database.interface";
import type { User } from "../../../../../domain/entities/user.entity";

export class PgUserRepository implements UserRepository<Kysely<DB>> {
  constructor(private readonly db: Kysely<DB>) {}

  async findById(id: string, db: Kysely<DB>) {
    const user = await db.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
    return user ?? null;
  }

  async findByEmail(email: string, db: Kysely<DB>) {
    const user = await db.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
    return user ?? null;
  }

  async create(user: User, db: Kysely<DB>): Promise<User> {
    return await db
      .insertInto("users")
      .values({
        email: user.email,
        password: user.password,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  update(user: User, db: Kysely<DB>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: string, db: Kysely<DB>): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

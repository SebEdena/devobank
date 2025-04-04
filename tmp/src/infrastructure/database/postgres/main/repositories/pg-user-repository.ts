import type { Kysely } from "kysely";
import type { UserRepository } from "../../../../../application/repositories/user-repository.interface";
import { User } from "../../../../../domain/entities/user.entity";
import type { PostgresDatabaseMain } from "../database";
import type { DB } from "../models";

export class PgUserRepository implements UserRepository<Kysely<DB>> {
  constructor(private readonly db: PostgresDatabaseMain) {}

  async findById(id: string, db: Kysely<DB> = this.db.instance) {
    const data = await db.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
    if (!data) {
      return null;
    }
    return new User(data);
  }

  async findByEmail(email: string, db: Kysely<DB> = this.db.instance) {
    const data = await db.selectFrom("users").selectAll().where("email", "=", email).executeTakeFirst();
    if (!data) {
      return null;
    }
    return new User(data);
  }

  async create(user: User, db: Kysely<DB> = this.db.instance) {
    const data = await db
      .insertInto("users")
      .values({
        email: user.email,
        password: user.password,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new User(data);
  }

  async update(user: User, db: Kysely<DB> = this.db.instance) {
    const data = await db.updateTable("users").set(user).where("id", "=", user.id).returningAll().executeTakeFirst();
    return data ? new User(data) : null;
  }

  async delete(id: string, db: Kysely<DB> = this.db.instance) {
    const data = await db.deleteFrom("users").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
    return data ? new User(data) : null;
  }
}

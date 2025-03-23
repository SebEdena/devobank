import { Kysely } from "kysely";
import { User, UserProps } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/interfaces/repositories/user-repository.interface";
import { Database } from "../database/main-db.types";

export class PgUserRepository implements UserRepository {
  constructor(private readonly db: Kysely<Database>) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.db.selectFrom("users").where("id", "=", id).selectAll().executeTakeFirst();

    if (!result) return null;

    return new User({
      id: result.id,
      username: result.username,
      email: result.email,
      passwordHash: result.password_hash,
      createdAt: new Date(result.created_at),
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await this.db.selectFrom("users").where("username", "=", username).selectAll().executeTakeFirst();

    if (!result) return null;

    return new User({
      id: result.id,
      username: result.username,
      email: result.email,
      passwordHash: result.password_hash,
      createdAt: new Date(result.created_at),
    });
  }

  async create(user: User): Promise<void> {
    await this.db
      .insertInto("users")
      .values({
        id: user.id,
        username: user.username,
        email: user.email,
        password_hash: user.passwordHash,
        created_at: user.createdAt.toISOString(),
      })
      .execute();
  }

  async update(user: User): Promise<void> {
    await this.db
      .updateTable("users")
      .set({
        username: user.username,
        email: user.email,
        password_hash: user.passwordHash,
      })
      .where("id", "=", user.id)
      .execute();
  }

  async delete(id: string): Promise<void> {
    await this.db.deleteFrom("users").where("id", "=", id).execute();
  }
}

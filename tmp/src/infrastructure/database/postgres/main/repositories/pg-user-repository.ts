import type { UserRepository } from "@domain/repositories/user-repository.interface";
import { User } from "@domain/entities/user.entity";
import type { PostgresDatabaseMain } from "../database";

export class PgUserRepository implements UserRepository {
    constructor(private readonly db: PostgresDatabaseMain) {}

    private instance(db?: PostgresDatabaseMain) {
        return db?.instance ?? this.db.instance;
    }

    async findById(id: string, db?: PostgresDatabaseMain) {
        const data = await this.instance(db).selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();
        if (!data) {
            return null;
        }
        return new User(data);
    }

    async findByEmail(email: string, db?: PostgresDatabaseMain) {
        const data = await this.instance(db)
            .selectFrom("users")
            .selectAll()
            .where("email", "=", email)
            .executeTakeFirst();
        if (!data) {
            return null;
        }
        return new User(data);
    }

    async create(user: User, db?: PostgresDatabaseMain) {
        const data = await this.instance(db)
            .insertInto("users")
            .values({
                email: user.email,
                password: user.password,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return new User(data);
    }

    async update(user: User, db?: PostgresDatabaseMain) {
        const data = await this.instance(db)
            .updateTable("users")
            .set(user)
            .where("id", "=", user.id)
            .returningAll()
            .executeTakeFirst();
        return data ? new User(data) : null;
    }

    async delete(id: string, db?: PostgresDatabaseMain) {
        const data = await this.instance(db)
            .deleteFrom("users")
            .where("id", "=", id)
            .returningAll()
            .executeTakeFirstOrThrow();
        return data ? new User(data) : null;
    }
}


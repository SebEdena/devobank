import type { User } from "@domain/entities/user.entity";
import type { Database } from "@domain/providers/database.interface";

export interface UserRepository {
    findById(id: string, db?: Database): Promise<User | null>;
    findByEmail(email: string, db?: Database): Promise<User | null>;
    create(user: User, db?: Database): Promise<User>;
    update(user: User, db?: Database): Promise<User | null>;
    delete(id: string, db?: Database): Promise<User | null>;
}


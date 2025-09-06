import type { User } from "@shared/core/domain/entities/user.entity";
import type { Database } from "@shared/core/domain/ports/database.interface";

export interface UserRepository {
  findById(id: string, db?: Database): Promise<User | null>;
  findByEmail(email: string, db?: Database): Promise<User | null>;
  create(user: User, db?: Database): Promise<User>;
  update(user: User, db?: Database): Promise<User | null>;
  delete(id: string, db?: Database): Promise<User | null>;
}

import type { User } from "../../domain/entities/user.entity";

export interface UserRepository {
  findById(id: string, db?: unknown): Promise<User | null>;
  findByEmail(email: string, db?: unknown): Promise<User | null>;
  create(user: User, db?: unknown): Promise<User>;
  update(user: User, db?: unknown): Promise<User | null>;
  delete(id: string, db?: unknown): Promise<User | null>;
}

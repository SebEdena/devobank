import type { User } from "../../domain/entities/user.entity";

export interface UserRepository<DB> {
  findById(id: string, db: DB): Promise<User | null>;
  findByEmail(email: string, db: DB): Promise<User | null>;
  create(user: User, db: DB): Promise<User>;
  update(user: User, db: DB): Promise<User | null>;
  delete(id: string, db: DB): Promise<User | null>;
}

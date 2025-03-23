import type { User } from "../../entities/user.entity";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

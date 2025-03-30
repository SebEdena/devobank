import type { User } from "../../domain/entities/user.entity";
import type { Database } from "../providers/database.interface";

export interface UserRepository {
  findById<DB>(id: string, db: Database<DB>): Promise<User | null>;
  findByEmail<DB>(username: string, db: Database<DB>): Promise<User | null>;
  create<DB>(user: User, db: Database<DB>): Promise<User>;
  update<DB>(user: User, db: Database<DB>): Promise<User>;
  delete<DB>(id: string, db: Database<DB>): Promise<void>;
}

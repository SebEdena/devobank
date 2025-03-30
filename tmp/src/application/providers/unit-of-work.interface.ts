import type { UserRepository } from "../repositories/user-repository.interface";
import type { Database } from "./database.interface";

export interface UnitOfWork<DB> {
  transaction<T>(operation: (db: Database<DB>) => T): Promise<T>;

  get users(): UserRepository;
}

export interface UnitOfWorkRead<DB> {
  transaction<T>(operation: (db: Database<DB>) => T): Promise<T>;
}

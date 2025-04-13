import type { UserRepository } from "../repositories/user-repository.interface";
import type { Database } from "./database.interface";

export interface UnitOfWork {
  transaction<T>(operation: (db: Database) => T): Promise<T>;
}

export interface UnitOfWorkMain extends UnitOfWork {
  get users(): UserRepository;
}

export interface UnitOfWorkRead extends UnitOfWork {}

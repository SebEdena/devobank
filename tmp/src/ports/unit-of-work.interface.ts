import type { UserRepository } from "@shared/ports/repositories/user-repository.interface";

export interface Database {
  get instance(): unknown;
}

export interface UnitOfWork {
  transaction<T>(operation: (db: Database) => T): Promise<T>;
}

export interface UnitOfWorkMain extends UnitOfWork {
  get users(): UserRepository;
}

export interface UnitOfWorkRead extends UnitOfWork {}

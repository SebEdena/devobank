import type { UserRepository } from "../repositories/user-repository.interface";

export interface UnitOfWork<DB> {
  transaction<T>(operation: (db: DB) => T): Promise<T>;
}

export interface UnitOfWorkMain<DB> extends UnitOfWork<DB> {
  get users(): UserRepository<DB>;
}

export interface UnitOfWorkRead<DB> extends UnitOfWork<DB> {
}

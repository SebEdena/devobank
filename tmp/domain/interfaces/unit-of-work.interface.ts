import type { UserRepository } from "./repositories/user-repository.interface";

export interface Transaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface UnitOfWork {
  getTransaction(): Promise<Transaction>;

  get users(): UserRepository;
}

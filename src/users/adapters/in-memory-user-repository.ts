/* eslint-disable @typescript-eslint/require-await */

import type { User } from 'src/users/entities/user.entity';
import type { IUserRepository } from 'src/users/ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private readonly database: User[] = []) {}

  async findByEmail(email: string) {
    const user = this.database.find((user) => user.props.email === email);
    return user ?? null;
  }

  async findById(userId: string) {
    const user = this.database.find((user) => user.props.id === userId);
    return user ?? null;
  }

  async create(user: User) {
    this.database.push(user);
  }
}

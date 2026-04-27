import type { User } from 'src/users/domain/entities/user.entity';
import type { IUserRepository } from 'src/users/ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(public database: User[] = []) {}

  findByEmail(email: string) {
    const user = this.database.find((user) => user.props.email === email);
    return Promise.resolve(user ?? null);
  }

  findById(userId: string) {
    const user = this.database.find((user) => user.props.id === userId);
    return Promise.resolve(user ?? null);
  }

  create(user: User) {
    this.database.push(user);
    return Promise.resolve();
  }
}

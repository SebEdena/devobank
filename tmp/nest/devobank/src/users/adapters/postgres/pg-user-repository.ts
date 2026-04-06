import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { PgUser, PgUserSchema } from './entities/user.pg-entity';
import { EntityManager } from '@mikro-orm/postgresql';

export class PgUserRepository implements IUserRepository {
  constructor(private readonly em: EntityManager) {}

  async findByEmail(email: string) {
    const user = await this.em.findOne(PgUserSchema, { email });
    return user ? this.toDomain(user) : null;
  }

  async findById(userId: string) {
    const user = await this.em.findOne(PgUserSchema, { id: userId });
    return user ? this.toDomain(user) : null;
  }

  async create(user: User) {
    const pgUser = this.toPersistence(user);
    this.em.create(PgUserSchema, pgUser);
    await this.em.flush();
  }

  protected toPersistence(user: User): PgUser {
    return {
      id: user.props.id,
      email: user.props.email,
      password: user.props.password,
      name: user.props.name,
    };
  }

  protected toDomain(user: PgUser): User {
    return new User({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
    });
  }
}

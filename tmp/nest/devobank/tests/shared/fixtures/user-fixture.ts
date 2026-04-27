import { User } from 'src/users/domain/entities/user.entity';
import { TestApp } from '../utils/test-app';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from 'src/users/ports/user-repository.interface';
import { IFixture } from '../utils/fixture';

export class UserFixture implements IFixture {
  constructor(public entity: User) {}

  async load(app: TestApp): Promise<void> {
    const userRepository = app.get<IUserRepository>(I_USER_REPOSITORY);

    await userRepository.create(this.entity.clone());
  }

  createAuthorizationToken(): string {
    return (
      'Basic ' +
      Buffer.from(
        `${this.entity.props.email}:${this.entity.props.password}`,
      ).toString('base64')
    );
  }
}

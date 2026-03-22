import { IStringHasher } from 'src/core/ports/string-hasher.interface';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import type { IAuthenticator } from '../ports/authenticator.interface';

export class BasicAuthenticator implements IAuthenticator {
  constructor(
    private readonly stringHasher: IStringHasher,
    private readonly userRepository: IUserRepository,
  ) {}

  async authenticate(token: string): Promise<User> {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    const user = await this.userRepository.findByEmail(email);

    if (user === null) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.stringHasher.compare(
      password,
      user.props.password,
    );

    if (!isPasswordValid) {
      throw new Error('Password invalid');
    }

    return user;
  }
}

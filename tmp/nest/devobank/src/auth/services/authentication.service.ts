import type { IStringHasher } from 'src/core/ports/string-hasher.interface';
import type { Request } from 'src/shared/request';
import type { User } from 'src/users/entities/user.entity';
import type { IUserRepository } from 'src/users/ports/user-repository.interface';
import type { ICredentialsMapper } from '../ports/credentials-mapper.interface';

export class AuthenticationService {
  constructor(
    private readonly credentialsMapper: ICredentialsMapper,
    private readonly stringHasher: IStringHasher,
    private readonly userRepository: IUserRepository,
  ) {}

  async authenticate(request: Request): Promise<User> {
    const credentials = this.credentialsMapper.mapRequestToCredentials(request);

    switch (credentials.type) {
      case 'email-password':
        return this.authenticateWithEmailPassword(credentials);
      default:
        throw new Error('Unsupported authentication type');
    }
  }

  private async authenticateWithEmailPassword(credentials: {
    type: 'email-password';
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await this.stringHasher.compare(
      credentials.password,
      user.props.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  }
}

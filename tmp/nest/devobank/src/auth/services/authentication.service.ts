import type { IStringHasher } from 'src/core/ports/string-hasher.interface';
import type { ApiRequest } from 'src/shared/request';
import type { User } from 'src/users/entities/user.entity';
import type { IUserRepository } from 'src/users/ports/user-repository.interface';
import { UnsupportedAuthenticationTypeException } from '../exceptions/unsupported-authentication-type.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import type { ICredentialsMapper } from '../ports/credentials-mapper.interface';
import { InvalidPasswordException } from '../exceptions/invalid-password.exception';

export class AuthenticationService {
  constructor(
    private readonly credentialsMapper: ICredentialsMapper,
    private readonly stringHasher: IStringHasher,
    private readonly userRepository: IUserRepository,
  ) {}

  async authenticate(request: ApiRequest): Promise<User> {
    const credentials = this.credentialsMapper.mapRequestToCredentials(request);

    switch (credentials.type) {
      case 'email-password':
        return this.authenticateWithEmailPassword(credentials);
      default:
        throw new UnsupportedAuthenticationTypeException();
    }
  }

  private async authenticateWithEmailPassword(credentials: {
    type: 'email-password';
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.userRepository.findByEmail(credentials.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await this.stringHasher.compare(
      credentials.password,
      user.props.password,
    );

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    return user;
  }
}

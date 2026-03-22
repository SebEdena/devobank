import { User } from 'src/users/entities/user.entity';

export const I_AUTHENTICATOR = 'IAuthenticator';

export interface IAuthenticator {
  authenticate(token: string): Promise<User>;
}

import { DomainException } from 'src/shared/exception';

export class UserNotFoundException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'user-not-found',
      message: 'User not found',
      status: 401,
    };
  }
}

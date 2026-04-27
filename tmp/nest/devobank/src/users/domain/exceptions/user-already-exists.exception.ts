import { DomainException } from 'src/shared/exception';

export class UserAlreadyExistsException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'user-already-exists',
      message: 'A user with the given email already exists.',
      status: 409,
    };
  }
}

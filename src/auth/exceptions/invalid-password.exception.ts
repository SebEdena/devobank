import { DomainException } from 'src/shared/exception';

export class InvalidPasswordException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'invalid-password',
      message: 'Invalid password.',
      status: 401,
    };
  }
}

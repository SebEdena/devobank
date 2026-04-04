import { DomainException } from 'src/shared/exception';

export class PasswordMissingException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'password-missing',
      message: 'Password is missing',
      status: 401,
    };
  }
}

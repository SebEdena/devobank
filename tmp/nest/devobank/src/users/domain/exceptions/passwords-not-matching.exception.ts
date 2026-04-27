import { DomainException } from 'src/shared/exception';

export class PasswordsNotMatchingException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'passwords-not-matching',
      message: 'Passwords do not match.',
      status: 400,
    };
  }
}

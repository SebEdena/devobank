import { DomainException } from 'src/shared/exception';

export class EmailMissingException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'email-missing',
      message: 'Email is missing',
      status: 401,
    };
  }
}

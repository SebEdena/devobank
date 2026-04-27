import { DomainException } from 'src/shared/exception';

export class UnsupportedAuthenticationTypeException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'unsupported-authentication-type',
      message: 'Unsupported authentication type',
      status: 401,
    };
  }
}

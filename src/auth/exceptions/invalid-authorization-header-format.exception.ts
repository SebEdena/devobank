import { DomainException } from 'src/shared/exception';

export class InvalidAuthorizationHeaderFormatException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'invalid-authorization-header-format',
      message: 'Invalid authorization header format',
      status: 401,
    };
  }
}

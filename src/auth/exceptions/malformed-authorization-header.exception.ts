import { DomainException } from 'src/shared/exception';

export class MalformedAuthorizationHeaderException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'malformed-authorization-header',
      message: 'Malformed authorization header',
      status: 401,
    };
  }
}

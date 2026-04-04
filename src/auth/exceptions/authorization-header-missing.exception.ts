import { DomainException } from 'src/shared/exception';

export class AuthorizationHeaderMissingException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'authorization-header-missing',
      message: 'Authorization header missing',
      status: 401,
    };
  }
}

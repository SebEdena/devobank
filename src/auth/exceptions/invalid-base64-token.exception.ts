import { DomainException } from 'src/shared/exception';

export class InvalidBase64TokenException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'invalid-base64-token',
      message: 'Invalid base64 token',
      status: 401,
    };
  }
}

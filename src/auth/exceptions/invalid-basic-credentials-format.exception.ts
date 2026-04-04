import { DomainException } from 'src/shared/exception';

export class InvalidBasicCredentialsFormatException extends DomainException {
  protected static override defaultPayload() {
    return {
      code: 'invalid-basic-credentials-format',
      message: 'Invalid credentials format, should be email:password in base64',
      status: 401,
    };
  }
}

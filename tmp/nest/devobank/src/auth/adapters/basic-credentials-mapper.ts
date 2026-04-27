import type { ApiRequest } from 'src/shared/request';
import type { AuthCredentials } from '../dtos/credentials';
import { AuthorizationHeaderMissingException } from '../domain/exceptions/authorization-header-missing.exception';
import { EmailMissingException } from '../domain/exceptions/email-missing.exception';
import { InvalidAuthorizationHeaderFormatException } from '../domain/exceptions/invalid-authorization-header-format.exception';
import { InvalidBase64TokenException } from '../domain/exceptions/invalid-base64-token.exception';
import { InvalidBasicCredentialsFormatException } from '../domain/exceptions/invalid-basic-credentials-format.exception';
import { MalformedAuthorizationHeaderException } from '../domain/exceptions/malformed-authorization-header.exception';
import { PasswordMissingException } from '../domain/exceptions/password-missing.exception';
import type { ICredentialsMapper } from '../ports/credentials-mapper.interface';

export class BasicCredentialsMapper implements ICredentialsMapper {
  mapRequestToCredentials(request: ApiRequest): AuthCredentials {
    const authHeader = request.headers?.authorization;

    if (!authHeader) {
      throw new AuthorizationHeaderMissingException();
    }

    if (!authHeader.startsWith('Basic ')) {
      throw new InvalidAuthorizationHeaderFormatException();
    }

    if (authHeader.split(' ').length !== 2) {
      throw new MalformedAuthorizationHeaderException();
    }

    const token = authHeader.split(' ')[1];
    let decoded: string;

    try {
      decoded = Buffer.from(token, 'base64').toString('utf-8');
    } catch {
      throw new InvalidBase64TokenException();
    }

    if (decoded.split(':').length !== 2) {
      throw new InvalidBasicCredentialsFormatException();
    }

    const [email, password] = decoded.split(':');

    if (!email) {
      throw new EmailMissingException();
    }

    if (!password) {
      throw new PasswordMissingException();
    }

    return {
      type: 'email-password',
      email,
      password,
    };
  }
}

import type { Request } from 'src/shared/request';
import type { AuthCredentials } from '../dtos/credentials';
import type { ICredentialsMapper } from '../ports/credentials-mapper.interface';

export class BasicCredentialsMapper implements ICredentialsMapper {
  mapRequestToCredentials(request: Request): AuthCredentials {
    const authHeader = request.headers?.authorization;

    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    if (!authHeader.startsWith('Basic ')) {
      throw new Error('Invalid authorization header format');
    }

    if (authHeader.split(' ').length !== 2) {
      throw new Error('Malformed authorization header');
    }

    const token = authHeader.split(' ')[1];
    let decoded: string;

    try {
      decoded = Buffer.from(token, 'base64').toString('utf-8');
    } catch {
      throw new Error('Invalid base64 token');
    }

    if (decoded.split(':').length !== 2) {
      throw new Error(
        'Invalid credentials format, should be email:password in base64',
      );
    }

    const [email, password] = decoded.split(':');

    if (!email) {
      throw new Error('Email is missing');
    }

    if (!password) {
      throw new Error('Password is missing');
    }

    return {
      type: 'email-password',
      email,
      password,
    };
  }
}

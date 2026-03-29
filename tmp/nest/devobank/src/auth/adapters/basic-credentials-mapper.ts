import type { Request } from 'src/shared/request';
import type { AuthCredentials } from '../dtos/credentials';
import type { ICredentialsMapper } from '../ports/credentials-mapper.interface';

export class BasicCredentialsMapper implements ICredentialsMapper {
  mapRequestToCredentials(request: Request): AuthCredentials {
    const authHeader = request.headers?.authorization;

    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    return {
      type: 'email-password',
      email,
      password,
    };
  }
}

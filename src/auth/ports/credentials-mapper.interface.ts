import { Request } from 'src/shared/request';
import { AuthCredentials } from '../dtos/credentials';

export const I_CREDENTIALS_MAPPER = 'ICredentialsMapper';

export interface ICredentialsMapper {
  mapRequestToCredentials(request: Request): AuthCredentials;
}

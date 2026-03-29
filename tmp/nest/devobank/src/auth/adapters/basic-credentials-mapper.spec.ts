import type { Request } from 'src/shared/request';
import type { User } from 'src/users/entities/user.entity';
import { userSeeds } from 'src/users/tests/user-seeds';
import { BasicCredentialsMapper } from './basic-credentials-mapper';

describe('AuthenticationService', () => {
  let credentialsMapper: BasicCredentialsMapper;

  beforeEach(() => {
    credentialsMapper = new BasicCredentialsMapper();
  });

  describe('Case: The token is present in the request', () => {
    const user: User = userSeeds.john;

    const token: string = Buffer.from(
      `${user.props.email}:${user.props.password}`,
    ).toString('base64');

    it('should return the correct credentials', () => {
      const request = {
        headers: {
          authorization: `Basic ${token}`,
        },
      } as Request;

      const credentials = credentialsMapper.mapRequestToCredentials(request);

      expect(credentials).toEqual({
        type: 'email-password',
        email: user.props.email,
        password: user.props.password,
      });
    });
  });

  describe('Case: The token is not present in the request', () => {
    it('should throw an error', () => {
      const request = {
        headers: {},
      } as Request;

      expect(() => {
        credentialsMapper.mapRequestToCredentials(request);
      }).toThrow();
    });
  });
});

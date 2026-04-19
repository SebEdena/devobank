import type { ApiRequest } from 'src/shared/request';
import type { User } from 'src/users/entities/user.entity';
import { userSeeds } from 'src/users/tests/user-seeds';
import { AuthorizationHeaderMissingException } from '../exceptions/authorization-header-missing.exception';
import { EmailMissingException } from '../exceptions/email-missing.exception';
import { InvalidAuthorizationHeaderFormatException } from '../exceptions/invalid-authorization-header-format.exception';
import { InvalidBasicCredentialsFormatException } from '../exceptions/invalid-basic-credentials-format.exception';
import { PasswordMissingException } from '../exceptions/password-missing.exception';
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
      } as ApiRequest;

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
      } as ApiRequest;

      expect(() => credentialsMapper.mapRequestToCredentials(request)).toThrow(
        AuthorizationHeaderMissingException,
      );
    });
  });

  describe('Case: The token is malformed', () => {
    it('should throw an error if the token lacks Basic prefix', () => {
      const request = {
        headers: {
          authorization: 'Bearer some-token',
        },
      } as ApiRequest;

      expect(() => credentialsMapper.mapRequestToCredentials(request)).toThrow(
        InvalidAuthorizationHeaderFormatException,
      );
    });

    it('should throw an error if the token is not properly base64 encoded', () => {
      const request = {
        headers: {
          authorization: 'Basic not-a-valid-base64',
        },
      } as ApiRequest;

      expect(() => credentialsMapper.mapRequestToCredentials(request)).toThrow(
        InvalidBasicCredentialsFormatException,
      );
    });

    it('should throw an error it the token does not contain a colon separator', () => {
      const malformedToken = Buffer.from('emailandpassword').toString('base64');

      const request = {
        headers: {
          authorization: `Basic ${malformedToken}`,
        },
      } as ApiRequest;

      expect(() => credentialsMapper.mapRequestToCredentials(request)).toThrow(
        InvalidBasicCredentialsFormatException,
      );
    });

    it('should throw an error if the token contains multiple colons', () => {
      const malformedToken = Buffer.from('email:password:extra').toString(
        'base64',
      );

      const request = {
        headers: {
          authorization: `Basic ${malformedToken}`,
        },
      } as ApiRequest;

      expect(() => credentialsMapper.mapRequestToCredentials(request)).toThrow(
        InvalidBasicCredentialsFormatException,
      );
    });

    it('should throw an error if the email is empty', () => {
      const malformedToken = Buffer.from(':password').toString('base64');

      const request = {
        headers: {
          authorization: `Basic ${malformedToken}`,
        },
      } as ApiRequest;

      expect(() => credentialsMapper.mapRequestToCredentials(request)).toThrow(
        EmailMissingException,
      );
    });

    it('should throw an error if the password is empty', () => {
      const malformedToken = Buffer.from('email:').toString('base64');

      const request = {
        headers: {
          authorization: `Basic ${malformedToken}`,
        },
      } as ApiRequest;

      expect(() => credentialsMapper.mapRequestToCredentials(request)).toThrow(
        PasswordMissingException,
      );
    });
  });
});

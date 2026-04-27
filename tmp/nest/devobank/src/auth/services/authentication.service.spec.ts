import { NoOpStringHasher } from 'src/core/adapters/noop-string-hasher';
import { InMemoryUserRepository } from 'src/users/adapters/in-memory-user-repository';
import { userSeeds } from '../../users/tests/user-seeds';
import { BasicCredentialsMapper } from '../adapters/basic-credentials-mapper';
import { AuthenticationService } from './authentication.service';
import type { ApiRequest } from 'src/shared/request';
import type { ICredentialsMapper } from '../ports/credentials-mapper.interface';
import { UnsupportedAuthenticationTypeException } from '../domain/exceptions/unsupported-authentication-type.exception';

describe('AuthenticationService', () => {
  let credentialsMapper: BasicCredentialsMapper;
  let stringHasher: NoOpStringHasher;
  let userRepository: InMemoryUserRepository;
  let service: AuthenticationService;

  function formatToken(email: string, password: string): string {
    return Buffer.from(`${email}:${password}`).toString('base64');
  }

  const john = userSeeds.get('john');

  beforeEach(() => {
    credentialsMapper = new BasicCredentialsMapper();
    stringHasher = new NoOpStringHasher();
    userRepository = new InMemoryUserRepository([john]);

    service = new AuthenticationService(
      credentialsMapper,
      stringHasher,
      userRepository,
    );
  });

  describe('Scenario: Email & Password Credentials', () => {
    describe('Case: Valid Credentials', () => {
      it('should authenticate successfully and return the user', async () => {
        const token = formatToken(john.props.email, john.props.password);

        const request = {
          headers: {
            authorization: `Basic ${token}`,
          },
        } as ApiRequest;

        const user = await service.authenticate(request);

        expect(user.props).toEqual(john.props);
      });

      it('should compare plain password with stored password', async () => {
        const compareSpy = jest.spyOn(stringHasher, 'compare');
        const token = formatToken(john.props.email, john.props.password);

        const request = {
          headers: {
            authorization: `Basic ${token}`,
          },
        } as ApiRequest;

        await service.authenticate(request);

        expect(compareSpy).toHaveBeenCalledWith(
          john.props.password,
          john.props.password,
        );
      });
    });

    describe('Case: Invalid Credentials', () => {
      it('should throw an error if the user is not found', async () => {
        const compareSpy = jest.spyOn(stringHasher, 'compare');
        const token = formatToken('nonexistent@example.com', 'password');

        const request = {
          headers: {
            authorization: `Basic ${token}`,
          },
        } as ApiRequest;

        await expect(() => service.authenticate(request)).rejects.toThrow(
          'User not found',
        );
        expect(compareSpy).not.toHaveBeenCalled();
      });

      it('should throw an error if the password is incorrect', async () => {
        const token = formatToken(john.props.email, 'wrongpassword');

        const request = {
          headers: {
            authorization: `Basic ${token}`,
          },
        } as ApiRequest;

        await expect(() => service.authenticate(request)).rejects.toThrow(
          'Invalid password',
        );
      });
    });
  });

  describe('Case: Invalid Request Format', () => {
    it('should propagate mapper validation errors', async () => {
      const request = {
        headers: {},
      } as ApiRequest;

      await expect(() => service.authenticate(request)).rejects.toThrow(
        'Authorization header missing',
      );
    });
  });

  describe('Case: Unsupported Authentication Type', () => {
    class UnsupportedCredentialsMapper implements ICredentialsMapper {
      mapRequestToCredentials() {
        return {
          type: 'unsupported-type',
        } as unknown as ReturnType<
          ICredentialsMapper['mapRequestToCredentials']
        >;
      }
    }

    beforeEach(() => {
      // Override the credentials mapper to return an unsupported type
      credentialsMapper = new UnsupportedCredentialsMapper();
      service = new AuthenticationService(
        credentialsMapper,
        stringHasher,
        userRepository,
      );
    });

    it('should throw an error for unsupported authentication types', async () => {
      const request = {
        headers: {
          authorization: 'UnsupportedType somevalue',
        },
      } as ApiRequest;

      await expect(() => service.authenticate(request)).rejects.toThrow(
        UnsupportedAuthenticationTypeException,
      );
    });
  });
});

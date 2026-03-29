import { NoOpStringHasher } from 'src/core/adapters/noop-string-hasher';
import { InMemoryUserRepository } from 'src/users/adapters/in-memory-user-repository';
import { userSeeds } from '../../users/tests/user-seeds';
import { BasicCredentialsMapper } from '../adapters/basic-credentials-mapper';
import { AuthenticationService } from './authentication.service';
import type { Request } from 'src/shared/request';
import { ICredentialsMapper } from '../ports/credentials-mapper.interface';

describe('AuthenticationService', () => {
  let credentialsMapper: BasicCredentialsMapper;
  let stringHasher: NoOpStringHasher;
  let userRepository: InMemoryUserRepository;
  let service: AuthenticationService;

  function formatToken(email: string, password: string): string {
    return Buffer.from(`${email}:${password}`).toString('base64');
  }

  beforeEach(() => {
    credentialsMapper = new BasicCredentialsMapper();
    stringHasher = new NoOpStringHasher();
    userRepository = new InMemoryUserRepository([userSeeds.john]);
    service = new AuthenticationService(
      credentialsMapper,
      stringHasher,
      userRepository,
    );
  });

  describe('Scenario: Email & Password Credentials', () => {
    describe('Case: Valid Credentials', () => {
      it('should authenticate successfully and return the user', async () => {
        const token = formatToken(
          userSeeds.john.props.email,
          userSeeds.john.props.password,
        );

        const request = {
          headers: {
            authorization: `Basic ${token}`,
          },
        } as Request;

        const user = await service.authenticate(request);

        expect(user).toEqual(userSeeds.john);
      });
    });

    describe('Case: Invalid Credentials', () => {
      it('should throw an error if the user is not found', async () => {
        const token = formatToken('nonexistent@example.com', 'password');

        const request = {
          headers: {
            authorization: `Basic ${token}`,
          },
        } as Request;

        await expect(() => service.authenticate(request)).rejects.toThrow(
          'User not found',
        );
      });

      it('should throw an error if the password is incorrect', async () => {
        const token = formatToken(userSeeds.john.props.email, 'wrongpassword');

        const request = {
          headers: {
            authorization: `Basic ${token}`,
          },
        } as Request;

        await expect(() => service.authenticate(request)).rejects.toThrow(
          'Invalid password',
        );
      });
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
      } as Request;

      await expect(() => service.authenticate(request)).rejects.toThrow(
        'Unsupported authentication type',
      );
    });
  });
});

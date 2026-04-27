import { NoOpStringHasher } from 'src/core/adapters/noop-string-hasher';
import { InMemoryUserRepository } from '../adapters/in-memory-user-repository';
import { SignupUser } from './signup-user';
import { FixedIdGenerator } from 'src/core/adapters/fixed-id-generator';
import { User } from '../domain/entities/user.entity';
import { userSeeds } from '../tests/user-seeds';
import { PasswordsNotMatchingException } from '../domain/exceptions/passwords-not-matching.exception';
import { UserAlreadyExistsException } from '../domain/exceptions/user-already-exists.exception';
import { EventService } from 'src/core/services/event.service';
import { InMemoryEventRepository } from 'src/core/adapters/in-memory-event-repository';
import { EventStatus } from 'src/core/domain/entities/event.entity';
import { FixedDateGenerator } from 'src/core/adapters/fixed-date-generator';
import { USER_CREATED } from '../domain/events';

describe('Feature: signin up a user', () => {
  let userRepository: InMemoryUserRepository;
  let eventRepository: InMemoryEventRepository;

  let stringHasher: NoOpStringHasher;
  let idGenerator: FixedIdGenerator;
  let dateGenerator: FixedDateGenerator;
  let eventService: EventService;

  let signupUser: SignupUser;

  function makeNewUserRequest(user: User) {
    return {
      name: user.props.name,
      email: user.props.email,
      password: user.props.password,
      confirmPassword: user.props.password,
    };
  }

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    eventRepository = new InMemoryEventRepository();

    stringHasher = new NoOpStringHasher();
    idGenerator = new FixedIdGenerator();
    dateGenerator = new FixedDateGenerator();

    eventService = new EventService(
      idGenerator,
      dateGenerator,
      eventRepository,
    );

    signupUser = new SignupUser(
      userRepository,
      stringHasher,
      idGenerator,
      eventService,
    );
  });

  describe('Scenario: user signs up successfully', () => {
    it('should create a new user in the repository', async () => {
      const user = userSeeds.get('john');
      const userToCreate = makeNewUserRequest(user);
      const expectedHashedPassword = await stringHasher.hash(
        user.props.password,
      );

      await signupUser.execute(userToCreate);

      expect(userRepository.database).toHaveLength(1);
      expect(userRepository.database[0].props).toEqual({
        id: 'id-1',
        name: user.props.name,
        email: user.props.email,
        password: expectedHashedPassword,
      });
    });

    it('should create an event', async () => {
      const user = userSeeds.get('john');
      const userToCreate = makeNewUserRequest(user);

      await signupUser.execute(userToCreate);

      expect(eventRepository.database).toHaveLength(1);
      expect(eventRepository.database[0].props).toMatchObject({
        id: 'id-1',
        type: USER_CREATED,
        status: EventStatus.PENDING,
        payload: {
          id: 'id-1',
          name: user.props.name,
          email: user.props.email,
        },
      });
    });
  });

  describe('Scenario: user fails to sign up', () => {
    it('should throw an error when passwords do not match', async () => {
      const user = userSeeds.get('john');
      const userToCreate = makeNewUserRequest(user);
      userToCreate.confirmPassword = 'different-password';

      await expect(signupUser.execute(userToCreate)).rejects.toThrow(
        PasswordsNotMatchingException,
      );

      expect(userRepository.database).toHaveLength(0);
    });

    it('should throw an error when email is already in use', async () => {
      const user = userSeeds.get('john');
      const userToCreate = makeNewUserRequest(user);

      // Pre-populate the repository with a user having the same email
      await userRepository.create(
        new User({
          id: 'existing-user-id',
          name: 'Existing User',
          email: user.props.email,
          password: await stringHasher.hash('some-password'),
        }),
      );

      await expect(signupUser.execute(userToCreate)).rejects.toThrow(
        UserAlreadyExistsException,
      );

      expect(userRepository.database).toHaveLength(1);
    });
  });
});

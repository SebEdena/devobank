import {
  I_USER_REPOSITORY,
  IUserRepository,
} from 'src/users/ports/user-repository.interface';
import { userSeeds } from 'src/users/tests/user-seeds';
import request from 'supertest';
import { UserFixture } from 'tests/shared/fixtures/user-fixture';
import { TestApp } from 'tests/shared/utils/test-app';

describe('Feature: user signup', () => {
  let app: TestApp;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Scenario: happy path', () => {
    it('should create the user', async () => {
      const usersRepository = app.get<IUserRepository>(I_USER_REPOSITORY);

      const userToCreate = userSeeds.john.clone();

      const response = await request(app.getHttpServer())
        .post('/users/signup')
        .send({
          email: userToCreate.props.email,
          password: userToCreate.props.password,
          confirmPassword: userToCreate.props.password,
          name: userToCreate.props.name,
        });

      expect(response.status).toBe(201);

      const createdUser = await usersRepository.findByEmail(
        userToCreate.props.email,
      );

      expect(createdUser).toBeDefined();
      expect(createdUser!.props.id).toEqual(expect.any(String));
      expect(createdUser!.props).toMatchObject({
        email: userToCreate.props.email,
        password: userToCreate.props.password,
        name: userToCreate.props.name,
      });
    });
  });

  describe('Scenario: a user already exists with the same email', () => {
    it('should reject', async () => {
      await new UserFixture(userSeeds.john).load(app);

      const response = await request(app.getHttpServer())
        .post('/users/signup')
        .send({
          email: userSeeds.john.props.email,
          password: userSeeds.john.props.password,
          confirmPassword: userSeeds.john.props.password,
          name: userSeeds.john.props.name,
        });

      expect(response.status).toBe(409);
    });
  });
});

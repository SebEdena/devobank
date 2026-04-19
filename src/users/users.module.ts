import { Module } from '@nestjs/common';
import { UsersPersistenceModule } from './users-persistence.module';
import { CoreModule } from 'src/core/core.module';
import { SignupUser } from './usecases/signup-user';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from './ports/user-repository.interface';
import {
  I_STRING_HASHER,
  IStringHasher,
} from 'src/core/ports/string-hasher.interface';
import {
  I_ID_GENERATOR,
  IIdGenerator,
} from 'src/core/ports/id-generator.interface';
import { UsersController } from './controllers/users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { GetProfile } from './usecases/get-profile';

@Module({
  imports: [CoreModule, AuthModule, UsersPersistenceModule],
  providers: [
    {
      provide: SignupUser,
      inject: [I_USER_REPOSITORY, I_STRING_HASHER, I_ID_GENERATOR],
      useFactory: (
        userRepository: IUserRepository,
        stringHasher: IStringHasher,
        idGenerator: IIdGenerator,
      ) => new SignupUser(userRepository, stringHasher, idGenerator),
    },
    GetProfile,
  ],
  controllers: [UsersController],
})
export class UsersModule {}

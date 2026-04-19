import { Module } from '@nestjs/common';
import { UsersPersistenceModule } from 'src/users/users-persistence.module';
import { CoreModule } from '../core/core.module';
import { BasicCredentialsMapper } from './adapters/basic-credentials-mapper';
import {
  I_CREDENTIALS_MAPPER,
  ICredentialsMapper,
} from './ports/credentials-mapper.interface';
import { AuthenticationService } from './services/authentication.service';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from 'src/users/ports/user-repository.interface';
import {
  I_STRING_HASHER,
  IStringHasher,
} from 'src/core/ports/string-hasher.interface';

@Module({
  imports: [CoreModule, UsersPersistenceModule],
  controllers: [],
  providers: [
    {
      provide: I_CREDENTIALS_MAPPER,
      useClass: BasicCredentialsMapper,
    },
    {
      provide: AuthenticationService,
      inject: [I_CREDENTIALS_MAPPER, I_STRING_HASHER, I_USER_REPOSITORY],
      useFactory: (
        credentialsMapper: ICredentialsMapper,
        stringHasher: IStringHasher,
        userRepository: IUserRepository,
      ) =>
        new AuthenticationService(
          credentialsMapper,
          stringHasher,
          userRepository,
        ),
    },
  ],
  exports: [AuthenticationService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import {
  I_USER_REPOSITORY,
  IUserRepository,
} from 'src/users/ports/user-repository.interface';
import { UserModule } from 'src/users/users.module';
import { CoreModule } from '../core.module';
import {
  I_STRING_HASHER,
  IStringHasher,
} from '../ports/string-hasher.interface';
import { BasicAuthenticator } from './adapters/basic-authenticator';
import { I_AUTHENTICATOR } from './ports/authenticator.interface';

@Module({
  imports: [CoreModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: I_AUTHENTICATOR,
      inject: [I_STRING_HASHER, I_USER_REPOSITORY],
      useFactory: (
        stringHasher: IStringHasher,
        userRepository: IUserRepository,
      ) => {
        return new BasicAuthenticator(stringHasher, userRepository);
      },
    },
  ],
})
export class AuthModule {}

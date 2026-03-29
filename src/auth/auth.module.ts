import { Module } from '@nestjs/common';
import { UsersPersistenceModule } from 'src/users/users-persistence.module';
import { CoreModule } from '../core/core.module';
import { BasicCredentialsMapper } from './adapters/basic-credentials-mapper';
import { I_CREDENTIALS_MAPPER } from './ports/credentials-mapper.interface';
import { AuthenticationService } from './services/authentication.service';

@Module({
  imports: [CoreModule, UsersPersistenceModule],
  controllers: [],
  providers: [
    {
      provide: I_CREDENTIALS_MAPPER,
      useClass: BasicCredentialsMapper,
    },
    AuthenticationService,
  ],
})
export class AuthModule {}

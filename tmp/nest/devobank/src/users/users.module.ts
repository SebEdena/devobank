import { Module } from '@nestjs/common';
import { UsersPersistenceModule } from './users-persistence.module';

@Module({
  imports: [UsersPersistenceModule],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { I_USER_REPOSITORY } from './ports/user-repository.interface';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PgUserSchema } from './adapters/postgres/entities/user.pg-entity';
import { PgUserRepository } from './adapters/postgres/pg-user-repository';
import { EntityManager } from '@mikro-orm/postgresql';

export const userEntities = [PgUserSchema];

@Module({
  imports: [MikroOrmModule.forFeature({ entities: userEntities })],
  controllers: [],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      inject: [EntityManager],
      useFactory: (em: EntityManager) => new PgUserRepository(em),
    },
  ],
  exports: [I_USER_REPOSITORY],
})
export class UsersPersistenceModule {}

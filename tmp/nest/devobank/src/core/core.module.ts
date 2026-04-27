import { Module } from '@nestjs/common';
import { CurrentDateGenerator } from './adapters/current-date-generator';
import { RandomIdGenerator } from './adapters/random-id-generator';
import {
  I_DATE_GENERATOR,
  IDateGenerator,
} from './ports/date-generator.interface';
import { I_ID_GENERATOR, IIdGenerator } from './ports/id-generator.interface';
import { I_STRING_HASHER } from './ports/string-hasher.interface';
import { BcryptStringHasher } from './adapters/bcrypt-string-hasher';
import {
  I_EVENT_REPOSITORY,
  IEventRepository,
} from './ports/event-repository.interface';
import { EventService } from './services/event.service';
import { PgEventSchema } from './adapters/postgres/entities/event.pg-entity';
import { PgEventRepository } from './adapters/postgres/pg-event-repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

export const coreEntities = [PgEventSchema];

@Module({
  imports: [MikroOrmModule.forFeature({ entities: coreEntities })],
  controllers: [],
  providers: [
    {
      provide: I_DATE_GENERATOR,
      useClass: CurrentDateGenerator,
    },
    {
      provide: I_ID_GENERATOR,
      useClass: RandomIdGenerator,
    },
    {
      provide: I_STRING_HASHER,
      useClass: BcryptStringHasher,
    },
    {
      provide: I_EVENT_REPOSITORY,
      inject: [EntityManager],
      useFactory: (em: EntityManager) => new PgEventRepository(em),
    },
    {
      provide: EventService,
      inject: [I_ID_GENERATOR, I_DATE_GENERATOR, I_EVENT_REPOSITORY],
      useFactory: (
        idGenerator: IIdGenerator,
        dateGenerator: IDateGenerator,
        eventRepository: IEventRepository,
      ) => {
        return new EventService(idGenerator, dateGenerator, eventRepository);
      },
    },
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR, I_STRING_HASHER, EventService],
})
export class CoreModule {}

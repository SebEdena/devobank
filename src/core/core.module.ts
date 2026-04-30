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
import {
  I_OUTBOX_LISTENER,
  IOutboxListener,
} from './ports/outbox-listener.interface';
import { EventService } from './services/event.service';
import { OutboxDispatcherService } from './services/outbox-dispatcher.service';
import { OutboxEventExecutorService } from './services/outbox-event-executor.service';
import { PgEventSchema } from './adapters/postgres/entities/event.pg-entity';
import { PgEventRepository } from './adapters/postgres/pg-event-repository';
import { PgOutboxListener } from './adapters/postgres/pg-outbox-listener';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config';

export const coreEntities = [PgEventSchema];

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: coreEntities }),
    EventEmitterModule.forRoot(),
  ],
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
      provide: I_OUTBOX_LISTENER,
      inject: [EventEmitter2, ConfigService],
      useFactory: (
        eventEmitter: EventEmitter2,
        configService: ConfigService,
      ): IOutboxListener =>
        new PgOutboxListener(
          configService.get<string>('mainDatabaseUrl')!,
          eventEmitter,
        ),
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
    OutboxEventExecutorService,
    OutboxDispatcherService,
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR, I_STRING_HASHER, EventService],
})
export class CoreModule {}

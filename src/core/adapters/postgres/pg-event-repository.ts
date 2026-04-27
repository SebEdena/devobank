import { EntityManager } from '@mikro-orm/postgresql';
import { IEventRepository } from 'src/core/ports/event-repository.interface';
import { PgEvent, PgEventSchema } from './entities/event.pg-entity';
import { Event, EventStatus } from 'src/core/domain/entities/event.entity';
import { EventNotFoundException } from 'src/core/domain/exceptions/event-not-found.exception';

export class PgEventRepository implements IEventRepository {
  constructor(private readonly em: EntityManager) {}

  async create(event: Event) {
    const pgEvent = this.toPersistence(event);
    this.em.create(PgEventSchema, pgEvent);
    await this.em.flush();
  }

  async findUnprocessed(): Promise<Event[]> {
    const pgEvents = await this.em.findAll(PgEventSchema, {
      where: { status: EventStatus.PENDING },
      orderBy: { occurredAt: 'asc' },
    });

    return pgEvents.map((pgEvent) => this.toDomain(pgEvent));
  }

  async update(
    event: Partial<Event> & {
      props: {
        id: string;
      };
    },
  ): Promise<void> {
    const pgEvent = await this.em.findOne(PgEventSchema, {
      id: event.props.id,
    });
    if (pgEvent) {
      this.em.assign(pgEvent, event.props);
      await this.em.flush();
    } else {
      throw new EventNotFoundException();
    }
  }

  protected toPersistence(event: Event): PgEvent {
    return {
      id: event.props.id,
      type: event.props.type,
      occurredAt: event.props.occurredAt,
      status: event.props.status,
      payload: event.props.payload,
    };
  }

  protected toDomain(event: PgEvent): Event {
    return new Event({
      id: event.id,
      type: event.type,
      occurredAt: event.occurredAt,
      status: event.status,
      payload: event.payload,
    });
  }
}

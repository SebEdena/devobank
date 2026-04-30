import { IEventRepository } from '../ports/event-repository.interface';
import { Event } from '../domain/entities/event.entity';
import { IIdGenerator } from '../ports/id-generator.interface';
import { IDateGenerator } from '../ports/date-generator.interface';

export class EventService {
  constructor(
    private idGenerator: IIdGenerator,
    private dateGenerator: IDateGenerator,
    private eventRepository: IEventRepository,
  ) {}

  async createEvent<P extends Record<string, any>>(
    type: string,
    payload: P,
  ): Promise<void> {
    await this.eventRepository.create(
      new Event({
        id: this.idGenerator.generate(),
        type,
        occurredAt: this.dateGenerator.now(),
        claimedAt: null,
        processedAt: null,
        payload: { ...payload },
      }),
    );
  }
}

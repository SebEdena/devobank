import { IEventRepository } from '../ports/event-repository.interface';
import { Event, EventStatus } from '../domain/entities/event.entity';
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
        status: EventStatus.PENDING,
        payload: { ...payload },
      }),
    );
  }

  async processEvents(): Promise<void> {
    const events = await this.eventRepository.findUnprocessed();
    for (const event of events) {
      console.log(`Processing event: ${event.props.type}`);
      await this.eventRepository.update(
        event.with({ id: event.props.id, status: EventStatus.PROCESSED }),
      );
    }
  }
}

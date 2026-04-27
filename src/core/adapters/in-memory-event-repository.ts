import { Event, EventStatus } from '../domain/entities/event.entity';
import { EventNotFoundException } from '../domain/exceptions/event-not-found.exception';
import { IEventRepository } from '../ports/event-repository.interface';

export class InMemoryEventRepository implements IEventRepository {
  public database: Event[] = [];

  create(event: Event): Promise<void> {
    this.database.push(event);
    return Promise.resolve();
  }

  findUnprocessed(): Promise<Event[]> {
    return Promise.resolve(
      this.database.filter(
        (event) => event.props.status !== EventStatus.PROCESSED,
      ),
    );
  }

  update(event: Partial<Event> & { props: { id: string } }): Promise<void> {
    const eventIndex = this.database.findIndex(
      (e) => e.props.id === event.props.id,
    );
    if (eventIndex !== -1) {
      this.database[eventIndex] = this.database[eventIndex].with({
        ...event.props,
      });
    } else {
      throw new EventNotFoundException();
    }
    return Promise.resolve();
  }
}

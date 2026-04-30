import { Event } from '../domain/entities/event.entity';
import { IEventRepository } from '../ports/event-repository.interface';

export class InMemoryEventRepository implements IEventRepository {
  public database: Event[] = [];

  create(event: Event): Promise<void> {
    this.database.push(event);
    return Promise.resolve();
  }

  findUnprocessedBatch(limit: number): Promise<Event[]> {
    const claimedEvents = this.database
      .filter(
        (event) =>
          event.props.processedAt === null && event.props.claimedAt === null,
      )
      .slice(0, limit);

    const now = new Date();
    const batch: Event[] = [];

    for (const event of claimedEvents) {
      const index = this.database.findIndex(
        (e) => e.props.id === event.props.id,
      );
      if (index !== -1) {
        this.database[index] = this.database[index].with({ claimedAt: now });
        batch.push(this.database[index]);
      }
    }

    return Promise.resolve(batch);
  }

  markProcessed(eventId: string): Promise<void> {
    const index = this.database.findIndex((e) => e.props.id === eventId);
    if (index !== -1) {
      this.database[index] = this.database[index].with({
        processedAt: new Date(),
      });
    }
    return Promise.resolve();
  }

  markUnclaimed(eventId: string): Promise<void> {
    const index = this.database.findIndex((e) => e.props.id === eventId);
    if (index !== -1 && this.database[index].props.processedAt === null) {
      this.database[index] = this.database[index].with({ claimedAt: null });
    }
    return Promise.resolve();
  }
}

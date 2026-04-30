export const I_EVENT_REPOSITORY = 'IEventRepository';
import { Event } from '../domain/entities/event.entity';

export interface IEventRepository {
  create(event: Event): Promise<void>;

  findUnprocessedBatch(limit: number): Promise<Event[]>;

  markProcessed(eventId: string): Promise<void>;

  markUnclaimed(eventId: string): Promise<void>;
}

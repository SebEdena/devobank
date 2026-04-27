export const I_EVENT_REPOSITORY = 'IEventRepository';
import { Event } from '../domain/entities/event.entity';

export interface IEventRepository {
  create(event: Event): Promise<void>;

  findUnprocessed(): Promise<Event[]>;

  update(event: Partial<Event> & { props: { id: string } }): Promise<void>;
}

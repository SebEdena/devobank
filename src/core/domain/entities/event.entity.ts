import { Entity } from 'src/shared/entity';

export enum EventStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

export type EventProps = {
  id: string;
  type: string;
  occurredAt: Date;
  status: EventStatus;
  payload: Record<string, any>;
};

export class Event extends Entity<EventProps> {
  protected cloneWith(props: Partial<EventProps>): this {
    return new Event({
      ...this.props,
      ...props,
    }) as this;
  }
}

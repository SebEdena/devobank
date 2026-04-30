import { Entity } from 'src/shared/entity';

export type EventProps = {
  id: string;
  type: string;
  occurredAt: Date;
  claimedAt: Date | null;
  processedAt: Date | null;
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

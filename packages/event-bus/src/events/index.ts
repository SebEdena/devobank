import { UserCreated, type UserCreatedPayload } from "./user-created.event";

export type MQEventPayload = Record<string, unknown>;

export abstract class MQEvent<Payload extends MQEventPayload> {
  static readonly type: string;
  protected eventId: string;

  constructor(private _payload: Payload) {
    this.eventId = crypto.randomUUID();
  }

  get payload(): Payload {
    return this._payload;
  }

  abstract get type(): string;

  serialize(): string {
    return JSON.stringify({ type: this.type, payload: this.payload });
  }
}

export function parseEventFromMq(event: string): MQEvent<MQEventPayload> {
  const parsedEvent: { type: string; payload: MQEventPayload } = JSON.parse(event);

  switch (parsedEvent.type) {
    case UserCreated.type:
      return new UserCreated(parsedEvent.payload as UserCreatedPayload);
    default:
      throw new Error(`Unknown event type: ${parsedEvent.type}`);
  }
}

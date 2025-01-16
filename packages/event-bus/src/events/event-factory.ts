import type { MQEvent, MQEventPayload } from "../event";
import { UserCreated, type UserCreatedPayload } from "./user-created.event";

export function parseEventFromMq(event: string): MQEvent<MQEventPayload> {
  const parsedEvent: { type: string; payload: MQEventPayload } = JSON.parse(event);

  switch (parsedEvent.type) {
    case UserCreated.type:
      return new UserCreated(parsedEvent.payload as UserCreatedPayload);
    default:
      throw new Error(`Unknown event type: ${parsedEvent.type}`);
  }
}

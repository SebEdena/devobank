import type { MQEvent, MQEventPayload } from "./events";

export abstract class MQEventProcessor<E extends MQEvent<MQEventPayload>> {
  abstract handle(event: E): Promise<void>;
}

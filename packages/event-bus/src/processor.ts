import type { MQEvent, MQEventPayload } from "./event";
import type { UserCreated } from "./events/user-created.event";

export abstract class MQEventProcessor<E extends MQEvent<MQEventPayload>> {
  abstract handle(event: E): Promise<void>;
}

export class NewBalanceProcessor extends MQEventProcessor<UserCreated> {
  async handle(event: UserCreated) {
    console.log("New user created", event.payload);
  }
}

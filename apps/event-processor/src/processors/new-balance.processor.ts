import type { UserCreated } from "@devobank/event-bus/src/events/user-created.event";
import { MQEventProcessor } from "@devobank/event-bus/src/processor";

export class NewBalanceProcessor extends MQEventProcessor<UserCreated> {
  async handle(event: UserCreated) {
    console.log("New user created", event.payload);
  }
}

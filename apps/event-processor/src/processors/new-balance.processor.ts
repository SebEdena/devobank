import type { UserCreated } from "@devobank/event-bus/src/events/user-created.event";
import { MQEventProcessor } from "@devobank/event-bus/src/processor";
import { db } from "@devobank/read-db";

export class NewBalanceProcessor extends MQEventProcessor<UserCreated> {
  async handle(event: UserCreated) {
    const { userId } = event.payload;
    db.insertInto("read_users").values({ id: userId, balance: 0 }).execute();
    console.log("New user created", event.payload);
  }
}

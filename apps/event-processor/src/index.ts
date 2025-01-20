import { makeConsumer } from "@devobank/event-bus";
import type { MQEvent, MQEventPayload } from "@devobank/event-bus/src/events";
import { UserCreated } from "@devobank/event-bus/src/events/user-created.event";
import type { MQEventProcessor } from "@devobank/event-bus/src/processor";
import { config } from "./config";
import { NewBalanceProcessor } from "./processors/new-balance.processor";

const processors = new Map<string, MQEventProcessor<MQEvent<MQEventPayload>>[]>([
  [UserCreated.type, [new NewBalanceProcessor()]],
]);
const consumer = await makeConsumer(config.MQ_EVENT_QUEUE);
await consumer.connect();
consumer.consumeMessages(processors);

console.log("Consumer started");

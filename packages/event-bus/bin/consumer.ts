import { makeConsumer } from "..";
import { config } from "../src/config";
import { NewBalanceProcessor } from "../src/processor";

const processors = new Map<string, NewBalanceProcessor[]>([["user.created", [new NewBalanceProcessor()]]]);
const consumer = await makeConsumer(config.MQ_EVENT_QUEUE);
await consumer.connect();
consumer.consumeMessages(processors);

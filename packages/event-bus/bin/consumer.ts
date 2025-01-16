import { makeConsumer } from "..";
import { NewBalanceProcessor } from "../src/processor";

const processors = new Map<string, NewBalanceProcessor[]>([["user.created", [new NewBalanceProcessor()]]]);
const consumer = await makeConsumer();
await consumer.connect();
consumer.consumeMessages(processors);

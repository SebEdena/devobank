import { makeProducer } from "@devobank/event-bus";
import { config } from "../config";

export async function eventProducer() {
  const producer = await makeProducer(config.MQ_EVENT_QUEUE);
  await producer.connect();
  return producer;
}

export const producer = await eventProducer();

import { config } from "./src/config";
import { MQConsumer } from "./src/mq/consumer";
import { MQProducer } from "./src/mq/producer";

export async function makeProducer(): Promise<MQProducer> {
  const producer = new MQProducer(
    { host: config.MQ_HOST, user: config.MQ_USER, password: config.MQ_PASSWORD },
    config.MQ_EVENT_QUEUE,
  );
  return producer;
}

export async function makeConsumer(): Promise<MQConsumer> {
  const consumer = new MQConsumer(
    { host: config.MQ_HOST, user: config.MQ_USER, password: config.MQ_PASSWORD },
    config.MQ_EVENT_QUEUE,
  );
  return consumer;
}

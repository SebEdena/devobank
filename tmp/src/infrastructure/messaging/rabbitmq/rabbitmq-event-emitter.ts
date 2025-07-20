import type { EventEmitter } from "@domain/ports/messaging.interface";
import { config } from "@shared/config";
import { MQClient } from "./amqp-client";

export class RabbitMQEventEmitter extends MQClient implements EventEmitter {
  constructor(queueName: string) {
    super(config.MQ_URL, config.MQ_EXCHANGE, config.MQ_QUEUE);
    this.initialize(queueName);
  }

  private async initialize(queueName: string) {
    await this.connect();
  }

  async emit(event: Record<string, unknown>): Promise<void> {}
}

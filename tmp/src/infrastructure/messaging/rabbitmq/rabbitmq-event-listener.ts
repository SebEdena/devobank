import { config } from "@shared/config";
import { Message } from "@domain/events";
import { MQClient } from "./amqp-client";

export class RabbitMqEventListener extends MQClient {
  constructor() {
    super(config.MQ_URL, config.MQ_EXCHANGE, config.MQ_QUEUE);
  }

  start() {
    this.connect();
  }

  async subscribe(callback: (message: Message) => unknown) {
    if (!this._channel) {
      throw new Error("Channel is not connected");
    }

    this._channel.consume(this._queue, async (msg) => {
      if (msg && this._channel) {
        try {
          const message = Message.parse(JSON.parse(msg.content.toString()));
          await callback(message);
          this._channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    });
  }
}

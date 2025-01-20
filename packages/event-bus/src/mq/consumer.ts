import type { MQEvent, MQEventPayload } from "../events";
import { parseEventFromMq } from "../events";
import type { MQEventProcessor } from "../processor";
import { MQClient } from "./client";

export class MQConsumer extends MQClient {
  async consumeMessages(processors: Map<string, MQEventProcessor<MQEvent<MQEventPayload>>[]>) {
    if (!this._channel) {
      throw new Error("Channel is not connected");
    }

    this._channel.consume(this._queue, (msg) => {
      if (msg && this._channel) {
        const message = parseEventFromMq(msg.content.toString());

        for (const processor of processors.get(message.type) ?? []) {
          processor.handle(message);
        }

        this._channel.ack(msg);
      }
    });
  }
}

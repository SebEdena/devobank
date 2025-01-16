import type { MQEvent, MQEventPayload } from "../event";
import { MQClient } from "./client";

export class MQProducer extends MQClient {
  async send(event: MQEvent<MQEventPayload>) {
    if (!this._channel) {
      throw new Error("Channel is not connected");
    }

    const ok = this._channel.sendToQueue(this._queue, Buffer.from(event.serialize()), {
      headers: { event: event.type },
      persistent: true,
    });

    if (!ok) {
      throw new Error("Failed to send message");
    }
  }
}

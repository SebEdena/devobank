import { EventEmitter } from "../../domain/interfaces/event-emitter.interface";
import { makePublisher } from "@devobank/event-bus";

export class RabbitMQEventEmitter implements EventEmitter {
  private publisher: any;

  constructor(queueName: string) {
    this.initialize(queueName);
  }

  private async initialize(queueName: string) {
    this.publisher = await makePublisher(queueName);
    await this.publisher.connect();
  }

  async emit(event: Record<string, any>): Promise<void> {
    await this.publisher.publish(event);
  }
}

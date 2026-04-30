import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event } from '../domain/entities/event.entity';
import {
  I_EVENT_REPOSITORY,
  type IEventRepository,
} from '../ports/event-repository.interface';
import { Inject } from '@nestjs/common';

@Injectable()
export class OutboxEventExecutorService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(I_EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  async execute(event: Event): Promise<void> {
    try {
      await this.eventEmitter.emitAsync(event.props.type, event.props.payload);
      await this.eventRepository.markProcessed(event.props.id);
    } catch {
      await this.eventRepository.markUnclaimed(event.props.id);
    }
  }
}

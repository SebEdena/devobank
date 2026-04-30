import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  I_EVENT_REPOSITORY,
  type IEventRepository,
} from '../ports/event-repository.interface';
import {
  I_OUTBOX_LISTENER,
  type IOutboxListener,
} from '../ports/outbox-listener.interface';
import { OutboxEventExecutorService } from './outbox-event-executor.service';

const BATCH_SIZE = 100;
const FALLBACK_POLL_MS = 3000;

@Injectable()
export class OutboxDispatcherService implements OnModuleInit, OnModuleDestroy {
  private fallbackTimer: NodeJS.Timeout | null = null;
  private draining = false;

  constructor(
    @Inject(I_OUTBOX_LISTENER)
    private readonly listener: IOutboxListener,
    @Inject(I_EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
    private readonly outboxEventExecutor: OutboxEventExecutorService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.listener.setNotificationHandler(async () => {
      await this.drain();
    });
    await this.listener.start();

    this.fallbackTimer = setInterval(() => {
      void this.drain();
    }, FALLBACK_POLL_MS);

    await this.drain();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    await this.listener.stop();
  }

  private async drain(): Promise<void> {
    if (this.draining) {
      return;
    }

    this.draining = true;
    try {
      while (true) {
        const events =
          await this.eventRepository.findUnprocessedBatch(BATCH_SIZE);
        if (events.length === 0) {
          break;
        }

        for (const event of events) {
          await this.outboxEventExecutor.execute(event);
        }

        if (events.length < BATCH_SIZE) {
          break;
        }
      }
    } finally {
      this.draining = false;
    }
  }
}

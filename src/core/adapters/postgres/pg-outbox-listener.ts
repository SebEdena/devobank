import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client } from 'pg';
import { IOutboxListener } from 'src/core/ports/outbox-listener.interface';

const CHANNEL = 'outbox_new_event';
const RECONNECT_DELAY_MS = 5000;

export class PgOutboxListener implements IOutboxListener {
  private client: Client | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private running = false;
  private notificationHandler: (() => Promise<void>) | null = null;

  constructor(
    private readonly connectionString: string,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  setNotificationHandler(handler: () => Promise<void>): void {
    this.notificationHandler = handler;
  }

  async start(): Promise<void> {
    this.running = true;
    await this.connect();
  }

  async stop(): Promise<void> {
    this.running = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.client) {
      this.client.removeAllListeners();
      await this.client.end();
      this.client = null;
    }
  }

  private async connect(): Promise<void> {
    this.client = new Client({ connectionString: this.connectionString });
    await this.client.connect();
    await this.client.query(`LISTEN ${CHANNEL}`);

    this.client.on('notification', () => {
      if (!this.notificationHandler) {
        return;
      }

      void this.notificationHandler();
    });
    this.client.on('error', () => {
      void this.scheduleReconnect();
    });
    this.client.on('end', () => {
      void this.scheduleReconnect();
    });
  }

  private async scheduleReconnect(): Promise<void> {
    if (!this.running || this.reconnectTimer) {
      return;
    }

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      if (!this.running) {
        return;
      }

      try {
        await this.connect();
      } catch {
        await this.scheduleReconnect();
      }
    }, RECONNECT_DELAY_MS);
  }
}

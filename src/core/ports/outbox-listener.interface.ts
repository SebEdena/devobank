export const I_OUTBOX_LISTENER = 'IOutboxListener';

export interface IOutboxListener {
  setNotificationHandler(handler: () => Promise<void>): void;

  start(): Promise<void>;

  stop(): Promise<void>;
}

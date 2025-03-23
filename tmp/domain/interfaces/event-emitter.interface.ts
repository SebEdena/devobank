export interface EventEmitter {
  emit(event: Record<string, unknown>): Promise<void>;
}

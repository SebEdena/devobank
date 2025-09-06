export interface EventEmitter {
  emit(event: Record<string, unknown>): Promise<void>;
}

export interface EventListener {
  subscribe(event: Record<string, unknown>): Promise<void>;
}

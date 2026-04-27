import { defineEntity, InferEntity, p } from '@mikro-orm/core';
import { EventStatus } from 'src/core/domain/entities/event.entity';

export const PgEventSchema = defineEntity({
  name: 'Event',
  properties: {
    id: p.string().primary(),
    type: p.string().length(128),
    occurredAt: p.datetime(),
    status: p.enum(() => EventStatus),
    payload: p.json<Record<string, any>>(),
  },
});

export type PgEvent = InferEntity<typeof PgEventSchema>;

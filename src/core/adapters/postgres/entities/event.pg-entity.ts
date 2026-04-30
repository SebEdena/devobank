import { defineEntity, InferEntity, p } from '@mikro-orm/core';

export const PgEventSchema = defineEntity({
  name: 'Event',
  properties: {
    id: p.string().primary(),
    type: p.string().length(128),
    occurredAt: p.datetime(),
    claimedAt: p.datetime().nullable(),
    processedAt: p.datetime().nullable(),
    payload: p.json<Record<string, any>>(),
  },
});

export type PgEvent = InferEntity<typeof PgEventSchema>;

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
  indexes: [
    {
      name: 'event_unprocessed_claimable_idx',
      expression:
        'create index "event_unprocessed_claimable_idx" on "event" ("occurred_at", "id") where "processed_at" is null and "claimed_at" is null',
    },
  ],
});

export type PgEvent = InferEntity<typeof PgEventSchema>;

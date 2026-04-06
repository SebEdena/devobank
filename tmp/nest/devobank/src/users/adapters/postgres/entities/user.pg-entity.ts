import { defineEntity, InferEntity, p } from '@mikro-orm/core';

export const PgUserSchema = defineEntity({
  name: 'User',
  properties: {
    id: p.string().primary(),
    email: p.string().length(128).unique(),
    password: p.string().length(128),
    name: p.string().length(256),
  },
});

export type PgUser = InferEntity<typeof PgUserSchema>;

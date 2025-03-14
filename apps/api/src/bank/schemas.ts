import { type Static, t } from "elysia";

export const BankGrant = t.Object({
  userId: t.String(),
  amount: t.Number(),
  type: t.String(),
});

export type BankGrant = Static<typeof BankGrant>;

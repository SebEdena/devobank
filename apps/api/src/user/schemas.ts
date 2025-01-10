import { type Static, t } from "elysia";

export const UserRead = t.Object({
  id: t.String(),
  email: t.String(),
});

export type UserRead = Static<typeof UserRead>;

export const UserCreate = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
});

export type UserCreate = Static<typeof UserCreate>;

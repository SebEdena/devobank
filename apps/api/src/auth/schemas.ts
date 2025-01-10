import type { Static } from "@sinclair/typebox";
import { t } from "elysia";

export const SignDTO = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
});

export type SignDTO = Static<typeof SignDTO>;

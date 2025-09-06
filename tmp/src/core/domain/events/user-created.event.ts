import { z } from "zod";

export const type = z.literal("user.created");
export type type = z.infer<typeof type>;

export const UserCreatedPayload = z.object({
  userId: z.string(),
  email: z.string(),
});
export type UserCreatedPayload = z.infer<typeof UserCreatedPayload>;

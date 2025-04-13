import { z } from "zod";
import { UserCreatedPayload, type as userCreated } from "./user-created.event";

export const Message = z.intersection(
  z.object({
    id: z.string().default(() => crypto.randomUUID()),
  }),
  z.union([
    z.object({
      type: userCreated,
      payload: UserCreatedPayload,
    }),
    z.object({
      type: z.literal("account.created"),
      payload: UserCreatedPayload,
    }),
  ]),
);

export type Message = z.infer<typeof Message>;

export function createMessage(type: Message["type"], payload: Message["payload"]): Message {
  return Message.parse({
    type,
    payload,
  });
}

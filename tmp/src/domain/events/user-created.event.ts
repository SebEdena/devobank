import type { User } from "../entities/user.entity";

export function makeUserCreatedEvent(user: User) {
  return {
    type: "user.created" as const,
    payload: {
      userId: user.id,
      email: user.email,
    },
  };
}

import type { User } from "../entities/user.entity";

export function makeUserCreatedEvent(user: User): {
  type: "user.created";
  payload: {
    userId: string;
    email: string;
  };
} {
  return {
    type: "user.created",
    payload: {
      userId: user.id,
      email: user.email,
    },
  };
}

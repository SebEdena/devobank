import { MQEvent, type MQEventPayload } from ".";

export interface UserCreatedPayload extends MQEventPayload {
  userId: string;
  email: string;
}

export class UserCreated extends MQEvent<UserCreatedPayload> {
  static override readonly type = "user.created";

  override get type(): string {
    return UserCreated.type;
  }
}

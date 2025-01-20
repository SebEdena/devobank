import { UserCreated } from "@devobank/event-bus/src/events/user-created.event";
import { db } from "@devobank/main-db";
import { ICommand } from "../../_shared/commands";
import { producer } from "../../events/producer";
import type { UserCreate, UserRead } from "../schemas";

export class CreateUserCommand extends ICommand<UserCreate, UserRead> {
  override execute() {
    return db.transaction().execute(async (tx) => {
      const user = await tx.insertInto("users").values(this.payload).returningAll().executeTakeFirstOrThrow();
      producer.send(new UserCreated({ userId: user.id, email: user.email }));
      return user;
    });
  }
}

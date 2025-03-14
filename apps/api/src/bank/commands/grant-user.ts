import { UserCreated } from "@devobank/event-bus/src/events/user-created.event";
import { db } from "@devobank/main-db";
import { ICommand } from "../../_shared/commands";
import { producer } from "../../events/producer";
import type { BankGrant, UserCreate, UserRead } from "../schemas";

export class CreateUserCommand extends ICommand<BankGrant, BankGrant> {
  override execute() {
    return db.transaction().execute(async (tx) => {
      const { userId, type, amount } = this.payload;
      const transaction = await tx
        .insertInto("transactions")
        .values({
          user_id: userId,
          transaction_type_id: type,
          amount,
        })
        .executeTakeFirstOrThrow();
    });
  }
}

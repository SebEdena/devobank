import { db } from "@devobank/main-db";
import { ICommand } from "../../_shared/commands";
import type { UserCreate, UserRead } from "../schemas";

export class CreateUserCommand extends ICommand<UserCreate, UserRead> {
  override async execute() {
    return await db.insertInto("users").values(this.payload).returningAll().executeTakeFirstOrThrow();
  }
}

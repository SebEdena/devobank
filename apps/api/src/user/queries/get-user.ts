import { type Selectable, type User, db } from "@devobank/main-db";
import { IQuery } from "../../_shared/queries";

export class GetUserQuery extends IQuery<
  | {
      id: string;
    }
  | {
      email: string;
    },
  Selectable<User> | undefined
> {
  override async execute() {
    if ("id" in this.payload) {
      return await db.selectFrom("users").selectAll().where("id", "=", this.payload.id).executeTakeFirst();
    }

    return await db.selectFrom("users").selectAll().where("email", "=", this.payload.email).executeTakeFirst();
  }
}

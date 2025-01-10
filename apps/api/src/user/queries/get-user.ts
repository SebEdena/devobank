import { type Selectable, type User, db } from "@devobank/main-db";
import { IQuery } from "../../_shared/queries";

export class GetUserQuery extends IQuery<
  {
    email: string;
  },
  Selectable<User> | undefined
> {
  override async execute() {
    return await db.selectFrom("users").selectAll().where("email", "=", this.payload.email).executeTakeFirst();
  }
}

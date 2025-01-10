import Elysia, { t } from "elysia";
import { GetUserQuery } from "./queries/get-user";

export const userController = new Elysia({ prefix: "/user" }).get(
  "/:id",
  ({ params: { email } }) => {
    return new GetUserQuery({ email }).execute();
  },
  {
    params: t.Object({
      email: t.String(),
    }),
  },
);

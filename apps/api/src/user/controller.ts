import Elysia from "elysia";
import { GetUserQuery } from "./queries/get-user";
import { authPlugin } from "../auth/middlewares";
import { Value } from "@sinclair/typebox/value";
import { UserRead } from "./schemas";

export const userController = new Elysia({ prefix: "/user" }).use(authPlugin).get("/me", async ({ userId, error }) => {
  const user = await new GetUserQuery({ email: userId }).execute();

  if (!user) {
    return error(404);
  }

  return Value.Parse(UserRead, user);
});

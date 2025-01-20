import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import type { Context } from "../app";
import { GetUserQuery } from "./queries/get-user";
import { UserRead } from "./schemas";

export const userController = new Elysia({ prefix: "/user" }).get("/me", async ({ userId, error }: Context) => {
  const user = await new GetUserQuery({ email: userId }).execute();

  if (!user) {
    return error(404);
  }

  return Value.Parse(UserRead, user);
});

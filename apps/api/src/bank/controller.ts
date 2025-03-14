import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import type { Context } from "../app";
import { BankGrant } from "./schemas";
import node from "@elysiajs/node";
import { GetUserQuery } from "../user/queries/get-user";

export const userController = new Elysia({ adapter: node(), prefix: "/bank" }).post(
  "/grant",
  async ({
    userId,
    error,
    body,
  }: Context & {
    body: BankGrant;
  }) => {
    const user = await new GetUserQuery({ id: userId }).execute();
    if (!user) {
      return error("Unauthorized");
    }

    const beneficiary = await new GetUserQuery({ id: body.userId }).execute();

    if (!beneficiary) {
      return error("Bad Request");
    }

    const { amount, type } = body;
  },
);

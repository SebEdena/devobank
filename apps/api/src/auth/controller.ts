import { Value } from "@sinclair/typebox/value";
import Elysia from "elysia";
import { CreateUserCommand } from "../user/commands/create-user";
import { GetUserQuery } from "../user/queries/get-user";
import { UserRead } from "../user/schemas";
import { accessTokenJwt } from "./middlewares";
import { SignDTO } from "./schemas";
import node from "@elysiajs/node";

export const authController = new Elysia({ adapter: node(), prefix: "/auth" })
  .use(accessTokenJwt)
  .post(
    "/sign-in",
    async ({ accessTokenJwt, body: { email, password }, error }) => {
      const user = await new GetUserQuery({ email }).execute();
      if (user === undefined || !Bun.password.verifySync(password, user.password)) {
        return error(401);
      }
      return await accessTokenJwt.sign({ userId: user.email });
    },
    {
      body: SignDTO,
    },
  )
  .post(
    "/sign-up",
    async ({ body: { email, password }, error }) => {
      let user = await new GetUserQuery({ email }).execute();

      if (user !== undefined) {
        return error(400, "User already exists");
      }

      user = await new CreateUserCommand({ email, password: Bun.password.hashSync(password) }).execute();

      return Value.Parse(UserRead, user);
    },
    {
      body: SignDTO,
    },
  );

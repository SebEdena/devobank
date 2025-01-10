import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { GetUserQuery } from "../user/queries/get-user";
import { SignDTO } from "./schemas";
import { CreateUserCommand } from "../user/commands/create-user";
import { Value } from "@sinclair/typebox/value";
import { UserRead } from "../user/schemas";

export const authController = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "accessTokenJwt",
      exp: "1h",
      secret: "blablabla",
    }),
  )
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

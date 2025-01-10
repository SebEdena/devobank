import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { GetUserQuery } from "../user/queries/get-user";

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
      const user = new GetUserQuery({ email }).execute();
      if (user === undefined /*|| user.password !== Bun.hash(password) */) {
        return error("Unauthorized", 401);
      }
      await accessTokenJwt.sign({ email });
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    },
  );

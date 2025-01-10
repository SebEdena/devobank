import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const accessTokenJwt = jwt({
  name: "accessTokenJwt",
  exp: "1h",
  secret: "blablabla",
});

export const authPlugin = new Elysia()
  .use(accessTokenJwt)
  .use(bearer())
  .derive({ as: "scoped" }, async ({ accessTokenJwt, bearer, error }) => {
    const data = await accessTokenJwt.verify(bearer);
    if (!data) {
      return error(401);
    }
    return { userId: data.userId as string };
  });

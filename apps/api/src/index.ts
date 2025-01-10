import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  // .guard(
  //   {
  //     headers: t.Object({ Authorization: t.String() }),
  //     beforeHandle: ({ headers, error }) => {
  //       if
  //       if (headers.Authorization !== "bearer") {
  //         return error("Unauthorized", 401);
  //       }
  //     },
  //   },
  //   (app) => app.use(userController),
  // )
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

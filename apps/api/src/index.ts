import { Elysia, t } from "elysia";
import { authController } from "./auth/controller";
import { userController } from "./user/controller";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(authController)
  .use(userController)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

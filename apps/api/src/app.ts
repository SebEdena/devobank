import { node } from "@elysiajs/node";
import Elysia, { type InferContext } from "elysia";
import { authController } from "./auth/controller";
import { authPlugin } from "./auth/middlewares";
import { userController } from "./user/controller";

const setup = new Elysia({ adapter: node() })
  .get("/", () => "Hello Elysia")
  .use(authController)
  .use(authPlugin);

export type Context = InferContext<typeof setup>;

export const app = setup.use(userController);

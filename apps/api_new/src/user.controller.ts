import { SignDTO } from "@devobank/core/domain/dtos/user/sign.dto";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const userApp = new Hono();

const adminApp = new Hono();

adminApp.get("/sign-up", zValidator("json", SignDTO), async (c) => {
  const body = await c.req.json<SignDTO>();
  return c.json({ message: "Admin sign-up endpoint", data: body });
});

import { Elysia } from "elysia";
import { CreateUserUseCase } from "../../use-cases/user/create-user.use-case";
import * as bcrypt from "bcrypt";

export function createUserController(createUserUseCase: CreateUserUseCase) {
  return new Elysia().post("/users", async ({ body }) => {
    const { username, email, password } = body as any;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const userId = await createUserUseCase.execute({
      username,
      email,
      passwordHash,
    });

    return { id: userId };
  });
}

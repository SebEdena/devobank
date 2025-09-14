import { LoginError, UserNotFoundError, UserPasswordMismatchError } from "@domain/errors/user.error";
import type { JwtHandler } from "@ports/jwt.interface";
import type { PasswordHandler } from "@ports/password-handler.interface";
import type { UnitOfWorkMain } from "@ports/unit-of-work.interface";
import { injectable } from "inversify";

export interface LoginUserDTO {
  email: string;
  password: string;
}

@injectable()
export class LoginUserUseCase {
  constructor(
    private readonly uowMain: UnitOfWorkMain,
    private readonly passwordHandler: PasswordHandler,
    private readonly jwtHandler: JwtHandler,
  ) {}

  async execute(data: LoginUserDTO): Promise<string> {
    const user = await this.uowMain.users.findByEmail(data.email);

    if (!user) {
      throw UserNotFoundError(data.email);
    }

    const passwordMatch = await this.passwordHandler.compare(data.password, user.password);

    if (!passwordMatch) {
      throw UserPasswordMismatchError();
    }

    try {
      const token = await this.jwtHandler.sign({ userId: user.id });
      return token;
    } catch (err) {
      throw LoginError(err instanceof Error ? err.message : "Unknown login error");
    }
  }
}

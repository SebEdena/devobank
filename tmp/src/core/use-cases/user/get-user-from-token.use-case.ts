import type { User } from "@shared/core/domain/entities/user.entity";
import {
  LoginError,
  UserNotFoundError,
} from "@shared/core/domain/errors/user.error";
import type { JwtHandler } from "@shared/ports/jwt.interface";
import type { UnitOfWorkMain } from "@shared/ports/unit-of-work.interface";
import { injectable } from "inversify";

export interface GetUserFromTokenDTO {
  token: string;
}

@injectable()
export class GetUserFromTokenUseCase {
  constructor(
    private readonly uowMain: UnitOfWorkMain,
    private readonly jwtHandler: JwtHandler,
  ) {}

  async execute(data: GetUserFromTokenDTO): Promise<User> {
    let userId: string;
    try {
      const payload = await this.jwtHandler.verify(data.token);
      userId = payload.userId;
    } catch (err) {
      throw LoginError(err instanceof Error ? err.message : "Invalid token");
    }

    const user = await this.uowMain.users.findById(userId);

    if (!user) {
      throw UserNotFoundError(userId);
    }

    return user;
  }
}

import { User } from "@domain/entities/user.entity";
import { UserEmailAlreadyInUseError } from "@domain/errors/user.error";
import { createMessage } from "@domain/events";
import type { EventEmitter } from "@ports/messaging.interface";
import type { PasswordHandler } from "@ports/password-handler.interface";
import type { UnitOfWorkMain } from "@ports/unit-of-work.interface";
import { injectable } from "inversify";

export interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;
}

@injectable()
export class CreateUserUseCase {
  constructor(
    private readonly uowMain: UnitOfWorkMain,
    private readonly eventEmitter: EventEmitter,
    private readonly passwordHandler: PasswordHandler,
  ) {}

  async execute(data: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const existingUser = await this.uowMain.users.findByEmail(data.email);

    if (existingUser) {
      throw UserEmailAlreadyInUseError(data.email);
    }

    const passwordHash = await this.passwordHandler.hash(data.passwordHash);

    const userData = new User({
      email: data.email,
      password: passwordHash,
    });

    const user = await this.uowMain.transaction(async (db) => {
      const userCreated = await this.uowMain.users.create(userData, db);

      // Emit event for CQRS
      await this.eventEmitter.emit(
        createMessage("user.created", {
          userId: userCreated.id,
          email: userCreated.email,
        }),
      );

      return userCreated;
    });

    return user;
  }
}

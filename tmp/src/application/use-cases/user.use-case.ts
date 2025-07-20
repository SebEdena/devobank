import { inject, injectable } from "inversify";
import type { UnitOfWork, UnitOfWorkMain } from "@domain/ports/unit-of-work.interface";
import type { EventEmitter } from "@domain/ports/messaging.interface";
import type { PasswordHandler } from "@domain/ports/password-handler.interface";
import { User } from "@domain/entities/user.entity";
import { createMessage, Message } from "@domain/events";
import { UserEmailAlreadyInUseError, UserNotFoundError, UserPasswordMismatchError } from "@domain/errors/user.error";

export interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;
}

@injectable()
export class UserUseCase {
  constructor(
    private readonly uowMain: UnitOfWorkMain,
    private readonly eventEmitter: EventEmitter,
    private readonly passwordHandler: PasswordHandler,
  ) {}

  async createUser(data: {
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

  async loginUser(email: string, password: string): Promise<User> {
    const user = await this.uowMain.users.findByEmail(email);

    if (!user) {
      throw UserNotFoundError(email);
    }

    const passwordMatch = await this.passwordHandler.compare(password, user.password);

    if (!passwordMatch) {
      throw UserPasswordMismatchError();
    }

    return user;
  }
}

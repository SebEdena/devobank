import { inject, injectable } from "inversify";
import type { UnitOfWork, UnitOfWorkMain } from "../../providers/unit-of-work.interface";
import type { EventEmitter } from "../../providers/messaging.interface";
import type { PasswordHandler } from "../../providers/password-handler.interface";
import { User } from "../../../domain/entities/user.entity";
import { createMessage, Message } from "../../../domain/events";

interface CreateUserDTO {
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

  async execute(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.uowMain.users.findByEmail(data.email);

    if (existingUser) {
      throw new Error("User email already in use");
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

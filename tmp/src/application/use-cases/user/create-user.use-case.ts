import { User, UserProps } from "../../../domain/entities/user.entity";
import { makeUserCreatedEvent } from "../../../domain/events/user-created.event";
import { EventEmitter } from "../../providers/messaging.interface";
import { UserRepository } from "../../repositories/user-repository.interface";

interface CreateUserDTO {
  username: string;
  email: string;
  passwordHash: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter,
  ) {}

  async execute(data: CreateUserDTO): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const userId = crypto.randomUUID();

    const userProps: UserProps = {
      id: userId,
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    };

    const user = new User(userProps);

    await this.userRepository.create(user);

    // Emit event for CQRS
    await this.eventEmitter.emit(makeUserCreatedEvent(user));

    return user.id;
  }
}

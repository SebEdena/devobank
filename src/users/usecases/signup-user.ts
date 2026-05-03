import { Executable } from 'src/shared/executable';
import { User } from '../domain/entities/user.entity';
import type { IUserRepository } from '../ports/user-repository.interface';
import type { IStringHasher } from 'src/core/ports/string-hasher.interface';
import { PasswordsNotMatchingException } from '../domain/exceptions/passwords-not-matching.exception';
import { UserAlreadyExistsException } from '../domain/exceptions/user-already-exists.exception';
import { IIdGenerator } from 'src/core/ports/id-generator.interface';
import { EventService } from 'src/core/services/event.service';
import { USER_CREATED, type UserCreated } from '../domain/events';
import { OnEvent } from '@nestjs/event-emitter';

type Request = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Response = {
  id: string;
};

export class SignupUser implements Executable<Request, Response> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly stringHasher: IStringHasher,
    private readonly idGenerator: IIdGenerator,
    private readonly eventService: EventService,
  ) {}

  async execute(request: Request): Promise<Response> {
    const { name, email, password, confirmPassword } = request;

    if (password !== confirmPassword) {
      throw new PasswordsNotMatchingException();
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.stringHasher.hash(password);

    const user = new User({
      id: this.idGenerator.generate(),
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    await this.eventService.createEvent<UserCreated>(USER_CREATED, {
      id: user.props.id,
      email: user.props.email,
      name: user.props.name,
    });

    return { id: user.props.id };
  }

  @OnEvent('user.created')
  async onUserCreated(event: UserCreated): Promise<void> {
    console.log(`User created: ${JSON.stringify(event)}`);
  }
}

import { Executable } from 'src/shared/executable';
import { User } from '../entities/user.entity';
import type { IUserRepository } from '../ports/user-repository.interface';
import type { IStringHasher } from 'src/core/ports/string-hasher.interface';
import { PasswordsNotMatchingException } from '../exceptions/passwords-not-matching.exception';
import { UserAlreadyExistsException } from '../exceptions/user-already-exists.exception';
import { IIdGenerator } from 'src/core/ports/id-generator.interface';

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

    return { id: user.props.id };
  }
}

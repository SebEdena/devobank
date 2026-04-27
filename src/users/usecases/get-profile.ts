import { Executable } from 'src/shared/executable';
import { User } from '../domain/entities/user.entity';

type Request = {
  user: User;
};

type Response = {
  id: string;
  name: string;
  email: string;
};

export class GetProfile implements Executable<Request, Response> {
  async execute(request: Request): Promise<Response> {
    const { user } = request;
    const { id, name, email } = user.props;

    return Promise.resolve({ id, name, email });
  }
}

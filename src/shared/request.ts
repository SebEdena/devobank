import { FastifyRequest } from 'fastify';
import { User } from 'src/users/domain/entities/user.entity';

export type ApiRequest = FastifyRequest['raw'];

export type AuthenticatedApiRequest = ApiRequest & {
  user: User;
};

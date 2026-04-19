import {
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import type { ApiRequest, AuthenticatedApiRequest } from 'src/shared/request';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: ApiRequest = context.switchToHttp().getRequest();

    const user = await this.authenticationService.authenticate(req);

    (req as AuthenticatedApiRequest).user = user;

    return true;
  }
}

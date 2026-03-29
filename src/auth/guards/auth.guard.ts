import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Observable } from 'rxjs';
import type { Request } from 'src/shared/request';
import type { AuthenticationService } from '../services/authentication.service';

export class AuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    return this.authenticationService
      .authenticate(req)
      .then(() => true)
      .catch(() => false);
  }
}

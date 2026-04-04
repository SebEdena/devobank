import { Body, Controller, Post } from '@nestjs/common';
import { SignupUser } from '../usecases/signup-user';

import {
  type SignupUserRequest,
  type SignupUserResponse,
  signupUserSchema,
} from '../contracts/signup.contract';
import { ZodValidationPipe } from 'src/core/pipes/zod-validation.pipe';

@Controller({
  path: 'users',
})
export class UsersController {
  constructor(private readonly signupUser: SignupUser) {}

  @Post('signup')
  async handleSignup(
    @Body(new ZodValidationPipe(signupUserSchema)) body: SignupUserRequest,
  ): Promise<SignupUserResponse> {
    return this.signupUser.execute({
      name: body.name,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SignupUser } from '../usecases/signup-user';

import {
  SignupUserRequest,
  SignupUserResponse,
} from '../contracts/signup.contract';
import { ZodResponse } from 'nestjs-zod';
import { Request } from '@nestjs/common';
import type { AuthenticatedApiRequest } from 'src/shared/request';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetProfileResponse } from '../contracts/get-profile.contract';
import { GetProfile } from '../usecases/get-profile';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({
  path: 'users',
})
export class UsersController {
  constructor(
    private readonly getProfile: GetProfile,
    private readonly signupUser: SignupUser,
  ) {}

  @Get('me')
  @ApiBearerAuth('basic')
  @UseGuards(AuthGuard)
  @ZodResponse({
    status: 200,
    description: 'Get profile',
    type: GetProfileResponse,
  })
  handleGetProfile(
    @Request() req: AuthenticatedApiRequest,
  ): Promise<GetProfileResponse> {
    const user = req.user;

    return this.getProfile.execute({ user });
  }

  @Post('signup')
  @ZodResponse({
    status: 201,
    description: 'Signup user',
    type: SignupUserResponse,
  })
  async handleSignup(
    @Body() body: SignupUserRequest,
  ): Promise<SignupUserResponse> {
    return this.signupUser.execute({
      name: body.name,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });
  }
}

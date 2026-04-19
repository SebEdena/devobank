import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';

const signupUserSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.email('Invalid email format.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
  confirmPassword: z
    .string()
    .min(6, 'Confirm Password must be at least 6 characters long.'),
});

export class SignupUserRequest extends createZodDto(signupUserSchema) {}

const signupUserResponseSchema = z.object({
  id: z.string(),
});

export class SignupUserResponse extends createZodDto(
  signupUserResponseSchema,
) {}

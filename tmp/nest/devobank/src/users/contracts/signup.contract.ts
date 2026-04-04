import { z } from 'zod';

export const signupUserSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    email: z.email('Invalid email format.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters long.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
  });

export type SignupUserRequest = z.infer<typeof signupUserSchema>;

export type SignupUserResponse = void;

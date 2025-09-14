import z from "zod";

export const SignDTO = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export type SignDTO = z.infer<typeof SignDTO>;

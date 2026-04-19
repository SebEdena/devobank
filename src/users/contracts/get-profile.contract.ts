import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';

const getProfileResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export class GetProfileResponse extends createZodDto(
  getProfileResponseSchema,
) {}

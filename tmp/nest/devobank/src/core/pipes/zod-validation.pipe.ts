import { BadRequestException, Injectable } from '@nestjs/common';
import { PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema<any>) {}

  transform(payload: unknown) {
    const result = this.schema.safeParse(payload);
    if (!result.success) {
      throw new BadRequestException({
        code: 'validation-error',
        message: 'Validation failed',
        details: result.error.issues.map((issue) => ({
          code: issue.code,
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    return result.data as unknown;
  }
}

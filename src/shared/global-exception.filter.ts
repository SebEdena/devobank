import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { DomainException } from './exception';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

export class ErrorResponse {
  code: string;
  message: string;
  status: number;
  details?: unknown;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as ZodError;

      const response: ErrorResponse = {
        code: 'validation-error',
        message: 'Validation failed',
        status: HttpStatus.BAD_REQUEST,
        details: zodError.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
        })),
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      reply.status(HttpStatus.BAD_REQUEST).send(response);
      return;
    }

    if (exception instanceof DomainException) {
      const response: ErrorResponse = {
        code: exception.code,
        message: exception.message,
        status: exception.status,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      reply.status(exception.status).send(response);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const payloadObject =
        typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>)
          : null;

      const message =
        typeof payload === 'string'
          ? payload
          : Array.isArray(payloadObject?.message)
            ? ((payloadObject.message as string[])[0] ?? exception.message)
            : ((payloadObject?.message as string | undefined) ??
              exception.message);

      const details =
        payloadObject?.details ??
        (Array.isArray(payloadObject?.message) ? payloadObject?.message : null);

      const response: ErrorResponse = {
        code: (payloadObject?.code as string | undefined) ?? `http-${status}`,
        message,
        status,
        details: details ?? undefined,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      reply.status(status).send(response);
      return;
    }

    const response: ErrorResponse = {
      code: 'internal-server-error',
      message: 'Internal server error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    request.log.error(
      { err: exception },
      `Unhandled exception on ${request.method} ${request.url}`,
    );

    reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
  }
}

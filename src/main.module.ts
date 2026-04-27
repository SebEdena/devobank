import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './core/app.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

function buildPinoHttpOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    level: process.env.LOG_LEVEL ?? (isProduction ? 'info' : 'debug'),
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie'],
      remove: true,
    },
    // Honour an incoming x-request-id or generate one; write it back so the
    // Fastify adapter and pino-http both use the exact same ID.
    genReqId: (req: {
      headers: Record<string, string | string[] | undefined>;
    }) => {
      const existing = req.headers['x-request-id'];
      const id =
        (Array.isArray(existing) ? existing[0] : existing) ?? randomUUID();
      req.headers['x-request-id'] = id;
      return id;
    },
    ...(isProduction
      ? {}
      : {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
              singleLine: true,
            },
          },
        }),
  };
}

@Module({
  imports: [
    AppModule,
    ConfigModule.forRoot(),
    LoggerModule.forRoot({ pinoHttp: buildPinoHttpOptions() }),
  ],
})
export class MainModule {}

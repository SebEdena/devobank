import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MainModule } from './main.module';
import { GlobalExceptionFilter } from './shared/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { randomUUID } from 'node:crypto';
import { Logger } from 'nestjs-pino';

const openApiConfig = new DocumentBuilder()
  .setTitle('Devobank API')
  .setDescription('The Devobank API description')
  .setVersion('1.0')
  .addTag('devobank')
  .addGlobalResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  .addGlobalResponse({
    status: 400,
    description: 'Bad Request',
  })
  .addBasicAuth(
    {
      type: 'http',
      scheme: 'basic',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Basic token',
    },
    'basic',
  )
  .build();

function buildFastifyOptions() {
  return {
    // Disable Fastify's built-in pino — nestjs-pino owns all logging.
    logger: false as const,
    // Keep Fastify req.id in sync with the x-request-id header set by pino-http.
    requestIdHeader: 'x-request-id',
    genReqId: (req: {
      headers: Record<string, string | string[] | undefined>;
    }) => {
      const h = req.headers['x-request-id'];
      return (Array.isArray(h) ? h[0] : h) ?? randomUUID();
    },
  };
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter(buildFastifyOptions()),
    { bufferLogs: true },
  );

  app.useLogger(app.get(Logger));
  app.flushLogs();

  app.useGlobalFilters(new GlobalExceptionFilter());

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', (_req, reply, _payload, done) => {
      void reply.header('x-request-id', _req.id);
      done();
    });

  SwaggerModule.setup(
    'api-docs',
    app,
    SwaggerModule.createDocument(
      app,
      cleanupOpenApiDoc({ ...openApiConfig, paths: {} }),
    ),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();

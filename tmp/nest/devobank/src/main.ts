import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MainModule } from './main.module';
import { GlobalExceptionFilter } from './shared/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    MainModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

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

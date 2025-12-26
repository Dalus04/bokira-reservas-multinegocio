import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { EnvService } from './config/env.service';
import { buildSwaggerConfig } from './config/swagger.config';
import { securityDefaults } from './config/security.config';

import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const env = app.get(EnvService);

  // CORS
  app.enableCors(securityDefaults.cors);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters (orden importa: prisma primero)
  app.useGlobalFilters(new PrismaExceptionFilter(), new HttpExceptionFilter());

  // Interceptors
  app.useGlobalInterceptors(new RequestIdInterceptor());

  // Swagger
  const swaggerConfig = buildSwaggerConfig({
    title: env.get('SWAGGER_TITLE'),
    description: env.get('SWAGGER_DESC'),
    version: env.get('SWAGGER_VERSION'),
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(env.get('SWAGGER_PATH'), app, document);

  const port = env.get('PORT');
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`✅ Bokira API running on http://localhost:${port}`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger on http://localhost:${port}/${env.get('SWAGGER_PATH')}`);
}

void bootstrap();

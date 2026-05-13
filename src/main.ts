import { apiReference } from '@scalar/nestjs-api-reference';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Plot-weaver API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const openApiDoc = cleanupOpenApiDoc(document);

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/docs-json', (_req: Request, res: Response) =>
    res.json(openApiDoc),
  );
  httpAdapter.use(
    '/docs',
    apiReference({
      url: '/docs-json',
      title: 'Plot-weaver API',
      layout: 'modern',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

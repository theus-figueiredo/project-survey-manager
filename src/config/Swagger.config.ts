import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Registers Swagger/OpenAPI documentation for the application.
 *
 * @param {INestApplication} app - The Nest application instance.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('EYF API')
    .setDescription('API for the EYF application')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'bearerAuth',
        description: 'JWT Bearer token',
        in: 'header',
      },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger-ui', app, document, {
    jsonDocumentUrl: '/v3/api-docs',
  });
}

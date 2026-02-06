import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('ImóvelPay API')
    .setDescription('Charges API Documentation')
    .setVersion('1.0')
    .addTag('charges')
    .addTag('customers')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  console.log(`Backend listening on http://localhost:${port}`);

  console.log(`Swagger is running on http://localhost:${port}/api`);
}

bootstrap();

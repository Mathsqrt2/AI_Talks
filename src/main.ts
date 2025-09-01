import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerMessages } from '@libs/constants';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AiTalks } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AiTalks, {
    logger: new ConsoleLogger({
      depth: 6,
      colors: true,
      prefix: `AI_Talks`,
      timestamp: true,
    }),
  });

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: `GET,POST,PUT,PATCH,DELETE`,
    allowedHeaders: `Content-Type, Authorization`,
  });

  const config = new DocumentBuilder()
    .setTitle(SwaggerMessages.description.appTitle())
    .setDescription(SwaggerMessages.description.appDescription())
    .setVersion(SwaggerMessages.description.appVersion())
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SwaggerMessages.description.apiRoute(), app, documentFactory, {
    jsonDocumentUrl: `swagger/json`,
    customSiteTitle: SwaggerMessages.description.appHeadingTitle(),
    customCss: `.swagger-ui .topbar { display: none !important; }`,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    always: true,
    transform: true,
  }))

  await app.listen(process.env.API_PORT);
}

bootstrap();
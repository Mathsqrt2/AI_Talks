import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { AiConversationV3Module } from './app.module';
import { SwaggerMessages } from '@libs/constants';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AiConversationV3Module, {
    logger: new ConsoleLogger({
      depth: 6,
      colors: true,
      prefix: `AI_Talks`,
      timestamp: true,
    }),
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
  }))

  await app.listen(process.env.API_PORT);
}

bootstrap();
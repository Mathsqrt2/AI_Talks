import { NestFactory } from '@nestjs/core';
import { AiConversationV3Module } from './conversation.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AiConversationV3Module, {
    logger: new ConsoleLogger({
      depth: 8,
      colors: true,
      prefix: `AI_Talks`,
      timestamp: true,
    }),
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    always: true,
  }))

  await app.listen(process.env.port ?? 3000);
}
bootstrap();

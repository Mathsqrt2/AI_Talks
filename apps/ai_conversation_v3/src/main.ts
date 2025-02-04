import { NestFactory } from '@nestjs/core';
import { AiConversationV3Module } from './conversation.module';

async function bootstrap() {
  const app = await NestFactory.create(AiConversationV3Module);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

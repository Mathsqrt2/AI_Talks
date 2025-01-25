import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AiTalksModule } from './ai_talks.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AiTalksModule);
  app.use(json());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(90);
}
bootstrap();

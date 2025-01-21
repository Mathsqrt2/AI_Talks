import { NestFactory } from '@nestjs/core';
import { Gadacz1Module } from './gadacz1.module';

async function bootstrap() {
  const app = await NestFactory.create(Gadacz1Module);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

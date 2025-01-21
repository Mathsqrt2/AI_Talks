import { NestFactory } from '@nestjs/core';
import { Gadacz1Module } from './gadacz1.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(Gadacz1Module);
  app.use(json())
  await app.listen(process.env.PORT1);
}
bootstrap();

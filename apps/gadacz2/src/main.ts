import { NestFactory } from '@nestjs/core';
import { Gadacz2Module } from './gadacz2.module';

async function bootstrap() {
  const app = await NestFactory.create(Gadacz2Module);
  await app.listen(process.env.PORT2);
}
bootstrap();

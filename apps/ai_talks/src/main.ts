import { NestFactory } from '@nestjs/core';
import { AiTalksModule } from './ai_talks.module';

async function bootstrap() {
  const app = await NestFactory.create(AiTalksModule);
  await app.listen(90);
}
bootstrap();

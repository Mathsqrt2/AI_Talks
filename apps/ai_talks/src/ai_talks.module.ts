import { Module } from '@nestjs/common';
import { AiTalksController } from './ai_talks.controller';
import { TelegramGatway } from './gateways/telegram.gateway';
import { Speaker1Service } from './speakers/speaker1.service';
import { Speaker2Service } from './speakers/speaker2.service';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers: [
    AiTalksController,
  ],
  providers: [
    TelegramGatway,
    Speaker1Service,
    Speaker2Service,
  ],
})
export class AiTalksModule { }

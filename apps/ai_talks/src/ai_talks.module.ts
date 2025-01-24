import { Module } from '@nestjs/common';
import { AiTalksController } from './ai_talks.controller';
import { AiTalksService } from './ai_talks.service';
import { MessagesGateway } from './ai_talks.gateway';

@Module({
  imports: [],
  controllers: [
    AiTalksController
  ],
  providers: [
    AiTalksService,
    MessagesGateway,
  ],
})
export class AiTalksModule { }

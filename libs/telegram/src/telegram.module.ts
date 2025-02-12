import { Module } from '@nestjs/common';
import { TelegramGateway } from './telegram.service';

@Module({
  providers: [
    TelegramGateway
  ],
  exports: [
    TelegramGateway
  ],
})
export class TelegramModule { }

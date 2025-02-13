import { Module } from '@nestjs/common';
import { TelegramGateway } from './telegram.service';
import { SettingsModule } from '@libs/settings';
import { LoggerModule } from '@libs/logger';

@Module({
  imports: [
    LoggerModule,
    SettingsModule,
  ],
  providers: [
    TelegramGateway,
  ],
  exports: [
    TelegramGateway,
  ],
})

export class TelegramModule { }

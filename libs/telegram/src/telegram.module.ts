import { TelegramGateway } from './telegram.service';
import { DatabaseModule } from '@libs/database';
import { SettingsModule } from '@libs/settings';
import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    SettingsModule,
    LoggerModule,
  ],
  providers: [
    TelegramGateway,
  ],
  exports: [
    TelegramGateway,
  ],
})

export class TelegramModule { }

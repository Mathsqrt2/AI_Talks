import { Module } from '@nestjs/common';
import { TelegramGateway } from './telegram.service';
import { SettingsModule } from '@libs/settings';

@Module({
  imports: [
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

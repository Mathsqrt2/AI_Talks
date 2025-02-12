import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { SettingsModule } from '@libs/settings';

@Module({
  imports: [
    SettingsModule
  ],
  providers: [
    Logger
  ],
  exports: [
    Logger
  ],
})

export class LoggerModule { }

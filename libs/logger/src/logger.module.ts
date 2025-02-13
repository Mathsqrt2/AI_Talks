import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { SettingsModule } from '@libs/settings';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    DatabaseModule,
    SettingsModule,
  ],
  providers: [
    Logger,
  ],
  exports: [
    Logger,
  ],
})

export class LoggerModule { }

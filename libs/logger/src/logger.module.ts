import { SettingsModule } from '@libs/settings';
import { DatabaseModule } from '@libs/database';
import { Logger } from './logger.service';
import { Module } from '@nestjs/common';

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

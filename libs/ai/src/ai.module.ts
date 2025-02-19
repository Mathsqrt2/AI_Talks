import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { SettingsModule } from '@libs/settings';
import { LoggerModule } from '@libs/logger';

@Module({
  imports: [
    SettingsModule,
    LoggerModule,
  ],
  providers: [
    AiService
  ],
  exports: [
    AiService
  ],
})
export class AiModule { }

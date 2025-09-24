import { SettingsModule } from '@libs/settings';
import { LoggerModule } from '@libs/logger';
import { AiService } from './ai.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    SettingsModule,
    LoggerModule.forFeature(AiService),
  ],
  providers: [
    AiService
  ],
  exports: [
    AiService
  ],
})
export class AiModule { }

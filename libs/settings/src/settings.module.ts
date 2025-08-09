import { SettingsService } from './settings.service';
import { DatabaseModule } from '@libs/database';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    SettingsService,
  ],
  exports: [
    SettingsService,
  ],
})

export class SettingsModule { }

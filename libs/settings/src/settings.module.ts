import { SettingsService } from './settings.service';
import { DatabaseModule } from '@libs/database';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
  ],
  providers: [
    SettingsService,
  ],
  exports: [
    SettingsService,
  ],
})

  export class SettingsModule { }

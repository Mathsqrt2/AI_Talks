import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { DatabaseModule } from '@libs/database';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    ConfigService
  ],
  exports: [
    ConfigService
  ],
})

export class SettingsModule { }

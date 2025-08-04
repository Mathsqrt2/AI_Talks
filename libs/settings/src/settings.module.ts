import { SettingsService } from './settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Entities from '@libs/database';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature(Object.values(Entities))
  ],
  providers: [
    SettingsService
  ],
  exports: [
    SettingsService
  ],
})

export class SettingsModule { }

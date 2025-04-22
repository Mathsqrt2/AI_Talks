import { SettingsService } from './settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '@libs/database';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities)
  ],
  providers: [
    SettingsService
  ],
  exports: [
    SettingsService
  ],
})

export class SettingsModule { }

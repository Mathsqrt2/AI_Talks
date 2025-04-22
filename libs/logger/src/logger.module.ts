import { SettingsModule } from '@libs/settings';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './logger.service';
import { entities } from '@libs/database';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
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

import { SettingsModule } from '@libs/settings';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Entities from '@libs/database';
import { Logger } from './logger.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature(Object.values(Entities)),
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

import { TelegramGateway } from './telegram.service';
import { SettingsModule } from '@libs/settings';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@libs/logger';
import * as Entities from '@libs/database';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature(Object.values(Entities)),
    SettingsModule,
    LoggerModule,
  ],
  providers: [
    TelegramGateway,
  ],
  exports: [
    TelegramGateway,
  ],
})

export class TelegramModule { }

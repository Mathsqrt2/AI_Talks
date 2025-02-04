import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { DatabaseModule } from '@libs/database';

@Module({
    imports: [DatabaseModule],
    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})

export class SettingsModule { }

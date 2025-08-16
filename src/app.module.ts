import { ConversationModule } from './conversation/conversation.module';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { SettingsModule } from './settings/settings.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Logger, LoggerModule } from '@libs/logger';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { LogMessage } from '@libs/constants';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    ConversationModule,
    SettingsModule,
    LoggerModule,
  ],
})

export class AiTalks implements OnApplicationBootstrap {

  private startTime: number = Date.now();
  constructor(
    private readonly logger: Logger
  ) { }

  public onApplicationBootstrap() {
    this.logger.log(LogMessage.log.onApplicationBootstrap(),
      { context: AiTalks.name, startTime: this.startTime })
  }

}

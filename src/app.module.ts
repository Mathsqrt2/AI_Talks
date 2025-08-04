import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, RequestMethod } from '@nestjs/common';
import { ConversationController } from './controllers/conversation.controller';
import { SettingsController } from './controllers/settings.controller';
import { ConversationService } from './conversation.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Logger, LoggerModule } from '@libs/logger';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from '@libs/telegram';
import { SettingsModule } from '@libs/settings';
import { DatabaseModule } from '@libs/database';
import { ConfigModule } from '@nestjs/config';
import { LogMessage } from '@libs/constants';
import { AiModule } from '@libs/ai';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    SettingsModule,
    TelegramModule,
    LoggerModule,
    AiModule,
  ],
  controllers: [
    ConversationController,
    SettingsController,
  ],
  providers: [
    ConversationService,
  ],
})

export class AiConversationV3Module implements OnApplicationBootstrap, NestModule {

  constructor(
    private readonly logger: Logger
  ) { }

  public onApplicationBootstrap() {
    this.logger.log(LogMessage.log.onApplicationBootstrap(), { context: AiConversationV3Module.name })
  }

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes({
      path: `*`,
      method: RequestMethod.ALL
    });
  }
}

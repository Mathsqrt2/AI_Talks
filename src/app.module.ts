import { ConversationModule } from './conversation/conversation.module';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { SettingsModule } from './settings/settings.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Logger, LoggerModule } from '@libs/logger';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LogMessage } from '@libs/constants';
import { resolve } from 'path';

@Module({
  imports: [
    EventEmitterModule.forRoot({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 15,
        },
        {
          ttl: 1000,
          limit: 3,
        }
      ]
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    ConversationModule,
    SettingsModule,
    LoggerModule,
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, `frontend`, `dist`),
      renderPath: `/ui`,
      exclude: [`/api`],
      serveStaticOptions: {
        maxAge: `1y`,
        etag: true,
        index: `index.html`,
      }
    })
  ]
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

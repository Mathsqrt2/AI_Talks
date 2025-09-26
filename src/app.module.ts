import { ConversationModule } from './conversation/conversation.module';
import { Logger, InjectLogger, LoggerModule } from '@libs/logger';
import { Module, OnApplicationBootstrap, Logger as NestLogger } from '@nestjs/common';
import { SettingsModule } from './settings/settings.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
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
    LoggerModule.forFeature(AiTalks),
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
    @InjectLogger(AiTalks) private readonly logger: Logger
  ) { }

  public onApplicationBootstrap() {
    this.logger.log(LogMessage.log.onApplicationBootstrap(), { startTime: this.startTime })
    this.logger.log(LogMessage.log.onApplicationBootstrapSeparator(), { startTime: this.startTime })
    this.logger.log(LogMessage.log.onApplicationBootstrapRef(process.env.NODE_ENV), { startTime: this.startTime })
    this.logger.log(LogMessage.log.onApplicationBootstrapSeparator(), { startTime: this.startTime })
  }

}

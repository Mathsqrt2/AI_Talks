import { DynamicModule, Module, Type } from '@nestjs/common';
import { LoggerTarget } from '@libs/types/logger.types';
import { SettingsModule } from '@libs/settings';
import { DatabaseModule, LogEntity } from '@libs/database';
import { Logger } from './logger.service';
import { getLoggerToken } from './inject-logger.decorator';
import { Repository } from 'typeorm';

@Module({
  imports: [
    DatabaseModule,
    SettingsModule,
  ],
})

export class LoggerModule {

  // static forFeature(targets: Type<LoggerTarget>[] | Type<LoggerTarget>): DynamicModule {
  //   if (!Array.isArray(targets)) { targets = [targets] };
  //   const providers = targets.map((target) => ({
  //     provide: getLoggerToken(target),
  //     useFactory: (repository: Repository<LogEntity>)
  //   }))


  // }

}

import { SettingsModule, SettingsService } from '@libs/settings';
import { DynamicModule, Module, Type } from '@nestjs/common';
import { DatabaseModule, LogEntity } from '@libs/database';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger, getLoggerToken } from './index';
import { LoggerTarget } from '@libs/types';
import { Repository } from 'typeorm';

@Module({
  imports: [
    DatabaseModule,
    SettingsModule,
  ],
})

export class LoggerModule {

  static forFeature(targets: Type<LoggerTarget>[] | Type<LoggerTarget>): DynamicModule {
    if (!Array.isArray(targets)) { targets = [targets] };
    const providers = targets.map((target) => ({
      provide: getLoggerToken(target),
      useFactory: (repository: Repository<LogEntity>, settings: SettingsService) => {
        const logger = new Logger(repository, settings, target.name);
        return logger;
      },
      inject: [
        getRepositoryToken(LogEntity),
        SettingsService,
      ]
    }));

    return {
      module: LoggerModule,
      providers,
      exports: providers,
    }
  }

}

import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Log } from './entities/log/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorConfig, LoggerConfig } from '@libs/types/logs';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {

    private readonly logger: Logger = new Logger(DatabaseService.name);

    constructor(
        @Inject(`LOG`) private readonly log: Repository<Log>,
    ) { }

    public async onApplicationBootstrap(): Promise<void> {
        // this.log.create({ label: 'asd', content: 'sadas' })
    }

    public saveLog = async (message: string, config: LoggerConfig | ErrorConfig): Promise<void> => {
        // mocked function
    }
}

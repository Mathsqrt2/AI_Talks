import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {

    private readonly logger: Logger = new Logger(DatabaseService.name);

    constructor(
        @InjectRepository(Log) private log: Repository<Log>
    ) { }

    public async onApplicationBootstrap(): Promise<void> {
        this.logger.error(`test`);
        this.log.create({
            content: `Application launded.`,
            label: `system_message`,
            created_at: Date.now(),
        })
        this.logger.error(`test2`);
    }
}

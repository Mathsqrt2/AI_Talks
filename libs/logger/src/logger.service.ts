import { SettingsService } from '@libs/settings';
import { SettingsFile } from '@libs/types/settings';
import { Injectable, Scope, Logger as NestLogger, OnApplicationBootstrap } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger implements OnApplicationBootstrap {

    private logger: NestLogger;
    private config: SettingsFile;

    public setContext = (context: string) => {
        this.logger = new NestLogger(context);
    }

    constructor(
        private readonly settings: SettingsService
    ) {
        this.logger = new NestLogger();
    }

    public onApplicationBootstrap() {
        this.settings.settings.subscribe((settingsFile: SettingsFile) => {
            this.config = settingsFile;
        });
    }

    public log = (message: any) => {


        this.logger.log(message);
    }

    public warn = (message: any) => {
        this.logger.warn(message);
    }

    public error = (message: any) => {
        this.logger.error(message);
    }

    public debug = (message: any) => {
        this.logger.debug(message);
    }

}

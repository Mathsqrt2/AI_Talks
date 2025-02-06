import { Injectable, Scope, Logger as NestLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger {

    private logger: NestLogger;

    public setContext = (context: string) => {
        this.logger = new NestLogger(context);
    }

    constructor() {
        this.logger = new NestLogger();
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

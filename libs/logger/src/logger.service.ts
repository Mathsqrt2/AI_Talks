import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { ErrorConfig, LoggerConfig } from '@libs/types/logs';
import { ConfigService } from '@libs/settings';
import { DatabaseService } from '@libs/database';
import { LogMessage } from 'apps/ai_conversation/src/constants/conversation.responses';

@Injectable()
export class Logger {

    private appName: string = __dirname.split("\\").pop();
    private logger: NestLogger;

    constructor(
        private readonly settings: ConfigService,
        private readonly database: DatabaseService,
    ) {
        this.logger = new NestLogger(this.appName);
    }

    private shouldLog = (): boolean => {
        return this.settings.app.state.shouldLog;
    }

    public log = (message: any, config?: LoggerConfig): void => {

        const context = config?.context || null;
        const save = config?.save || false;

        if (save) {
            try {
                this.database.saveLog(message, config);
            } catch (error) {
                this.error(LogMessage.error.onSaveLogFail(`log`), { error });
            }
        }

        if (!this.shouldLog()) {
            return;
        }

        context
            ? this.logger.log(message, context)
            : this.logger.log(message)
    }

    public warn = (message: any, config?: LoggerConfig): void => {

        const context = config?.context || null;
        const save = config?.save || false;

        if (save) {
            try {
                this.database.saveLog(message, config);
            } catch (error) {
                this.error(LogMessage.error.onSaveLogFail(`warn`), { error });
            }
        }

        if (!this.shouldLog()) {
            return;
        }

        context
            ? this.logger.warn(message, context)
            : this.logger.warn(message)
    }

    public error = (message: any, config?: ErrorConfig): void => {

        const context = config?.context || null;
        const save = config?.save || false;
        const error = config?.error || null;

        if (save) {
            try {
                this.database.saveLog(message, config);
            } catch (error) {
                this.error(LogMessage.error.onSaveLogFail(`error`), { error });
            }
        }

        if (!this.shouldLog()) {
            return;
        }

        if (error) {
            context
                ? this.logger.error(message, error, context)
                : this.logger.error(message, context);
            return;
        }

        this.logger.error(message)
    }

    public debug = (message: any, config?: LoggerConfig): void => {

        const context = config?.context || null;
        const save = config?.save || false;

        if (save) {
            try {
                this.database.saveLog(message, config);
            } catch (error) {
                this.error(LogMessage.error.onSaveLogFail(`debug`), { error });
            }
        }

        if (!this.shouldLog()) {
            return;
        }

        context
            ? this.logger.debug(message, context)
            : this.logger.debug(message);
    }
}
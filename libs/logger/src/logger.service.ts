import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { ErrorConfig, LoggerConfig } from '@libs/types/logs';
import { SettingsService } from '@libs/settings';
import { DatabaseService } from '@libs/database';

@Injectable()
export class Logger {

    private appName: string = __dirname.split("\\").pop();
    private logger: NestLogger;

    constructor(
        private readonly settings: SettingsService,
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
                this.error(`Failed to save log in database.`, { error });
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
                this.error(`Failed to save warn log in database.`, { error });
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
                this.error(`Failed to save error log in database.`, { error });
            }
        }

        if (!this.shouldLog()) {
            return;
        }

        context
            ? this.logger.error(message, error || null, context)
            : this.logger.error(message, context)
    }

    public debug = (message: any, config?: LoggerConfig): void => {

        const context = config?.context || null;
        const save = config?.save || false;

        if (save) {
            try {
                this.database.saveLog(message, config);
            } catch (error) {
                this.error(`Failed to save debug log in database.`, { error });
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
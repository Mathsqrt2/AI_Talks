import { LogMessage } from 'apps/ai_conversation/src/constants/conversation.responses';
import { Injectable, Logger as NestLogger, NestMiddleware } from '@nestjs/common';
import { ErrorConfig, LoggerConfig } from '@libs/types/logs';
import { Log } from '@libs/database/entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsService } from '@libs/settings';
import { Repository } from 'typeorm';

@Injectable()
export class Logger implements NestMiddleware {

    private appName: string = __dirname.split("\\").pop();
    private logger: NestLogger;

    constructor(
        @InjectRepository(Log) private readonly logs: Repository<Log>,
        private readonly settings: SettingsService,
    ) {
        this.logger = new NestLogger(this.appName);
    }

    use(req: any, res: any, next: (error?: any) => void) {
        NestLogger.warn(`dziala`);
    }

    private shouldLog = (): boolean => {
        return this.settings.app.state.shouldLog;
    }

    public log = (message: any, config?: LoggerConfig): void => {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;

        if (save) {
            this.logs.save({
                content: message,
                label: `LOG`,
                conversationId: this.settings.app.conversationId || null,
            }).catch(error => {
                this.error(LogMessage.error.onSaveLogFail(`log`), { error });
            });
        }

        if (!this.shouldLog()) {
            return;
        }

        context
            ? NestLogger.log(message, context)
            : this.logger.log(message)
    }

    public warn = (message: any, config?: LoggerConfig): void => {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;

        if (save) {
            this.logs.save({
                content: message,
                label: `WARN`,
                conversationId: this.settings.app.conversationId || null,
            }).catch(error => {
                this.error(LogMessage.error.onSaveLogFail(`warn`), { error });
            });
        }

        if (!this.shouldLog()) {
            return;
        }

        context
            ? NestLogger.warn(message, context)
            : this.logger.warn(message)
    }

    public error = (message: any, config?: ErrorConfig): void => {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;
        const error = config?.error ?? null;

        if (save) {
            this.logs.save({
                content: message,
                label: `ERROR`,
                conversationId: this.settings.app.conversationId || null,
                error: config?.error ? JSON.stringify(config.error) : null,
            }).catch(error => {
                this.error(LogMessage.error.onSaveLogFail(`error`), { error });
            });
        }

        if (!this.shouldLog()) {
            return;
        }

        if (error) {
            context
                ? NestLogger.error(error, context)
                : this.logger.error(error);
        }

        context
            ? NestLogger.error(message, error)
            : this.logger.error(message);
    }

    public debug = (message: any, config?: LoggerConfig): void => {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;

        if (save) {
            this.logs.save({
                content: message || ``,
                label: `DEBUG`,
                conversationId: this.settings.app.conversationId || null,
            }).catch(error => {
                this.error(LogMessage.error.onSaveLogFail(`debug`), { error });
            });
        }

        if (!this.shouldLog()) {
            return;
        }

        context
            ? NestLogger.debug(message, context)
            : this.logger.debug(message);
    }
}
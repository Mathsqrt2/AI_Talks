import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { ErrorConfig, LoggerConfig } from '@libs/types';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsService } from '@libs/settings';
import { LogMessage } from '@libs/constants';
import { LogsLabelsEnum } from '@libs/enums';
import { Log } from '@libs/database';
import { Repository } from 'typeorm';

@Injectable()
export class Logger {

    private appName: string = `ai_talks`;
    private logger: NestLogger;

    constructor(
        @InjectRepository(Log) private readonly logs: Repository<Log>,
        private readonly settings: SettingsService,
    ) {
        this.logger = new NestLogger(this.appName);
    }

    private shouldLog(): boolean {
        return this.settings.app.state.shouldLog;
    }

    private async saveLog(message: any, label: LogsLabelsEnum, config?: ErrorConfig): Promise<void> {

        if (typeof message === `object`) {
            message = JSON.stringify(message);
        }

        if (typeof message === `number`) {
            message = message.toString();
        }

        const log = this.logs.create({
            content: message,
            label,
            conversationId: this.settings.app.conversationId || null,
            error: config?.error ? JSON.stringify(config.error) : null,
            duration: config?.startTime
                ? Date.now() - config.startTime
                : null
        });

        try {
            await this.logs.save(log);
        } catch (error) {
            this.error(LogMessage.error.onSaveLogFail(label?.toLowerCase()), { error });
        }

    }

    public log(message: any, config?: LoggerConfig): string {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;

        if (save) {
            this.saveLog(message, LogsLabelsEnum.LOG, config);
        }

        if (!this.shouldLog()) {
            return message;
        }

        context
            ? NestLogger.log(message, context)
            : this.logger.log(message);

        return message;
    }

    public warn(message: any, config?: LoggerConfig): string {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;

        if (save) {
            this.saveLog(message, LogsLabelsEnum.WARN, config);
        }

        if (!this.shouldLog()) {
            return message;
        }

        context
            ? NestLogger.warn(message, context)
            : this.logger.warn(message);

        return message;
    }

    public error(message: any, config?: ErrorConfig): void {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;
        const error = config?.error ?? null;

        if (save) {
            this.saveLog(message, LogsLabelsEnum.ERROR, config);
        }

        if (!this.shouldLog()) {
            return message;
        }

        if (error) {
            context
                ? NestLogger.error(error, context)
                : this.logger.error(error);
        }

        context
            ? NestLogger.error(message, error)
            : this.logger.error(message);

        return message;
    }

    public debug(message: any, config?: LoggerConfig): void {

        const context = config?.context ?? null;
        const save = config?.save ?? this.settings.app.state.shouldArchiveLog;

        if (save) {
            this.saveLog(message, LogsLabelsEnum.DEBUG, config);
        }

        if (!this.shouldLog()) {
            return message;
        }

        context
            ? NestLogger.debug(message, context)
            : this.logger.debug(message);

        return message;
    }
    
}
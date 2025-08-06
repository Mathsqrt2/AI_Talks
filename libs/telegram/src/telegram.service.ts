import * as TelegramBot from 'node-telegram-bot-api';
import { SettingsService } from '@libs/settings';
import { LogMessage } from '@libs/constants';
import { Injectable } from '@nestjs/common';
import { Logger } from '@libs/logger';
import { Bot } from '@libs/types';


@Injectable()
export class TelegramGateway {

    private speaker1: TelegramBot = null;
    private speaker2: TelegramBot = null;

    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) {

        const startTime: number = Date.now();
        try {
            this.speaker1 = new TelegramBot(process.env.TOKEN1, { polling: true });
            this.logger.log(LogMessage.log.onBotConnected(`bot_1`), { startTime });
        } catch (error) {
            this.logger.error(LogMessage.error.onBotConnectionFail(`bot_1`), { error, startTime });
            this.speaker1 = null;
        }

        try {
            this.speaker2 = new TelegramBot(process.env.TOKEN2, { polling: true });
            this.logger.log(LogMessage.log.onBotConnected(`bot_2`), { startTime });
        } catch (error) {
            this.logger.error(LogMessage.error.onBotConnectionFail(`bot_2`), { error, startTime });
            this.speaker2 = null;
        }

    }

    public respondBy = async (who: Bot, content: string): Promise<boolean> => {

        const startTime: number = Date.now();
        if (!this.speaker1 || !this.speaker2) {
            this.logger.error(LogMessage.error.onBotConnectionFail(who.name), { startTime });
            return false;
        }

        if (this.settings.app.state.shouldDisplayResponse) {
            this.logger.log(content, { context: who.name, startTime });
        }

        if (!this.settings.app.state.shouldSendToTelegram) {
            return false;
        }

        if (content === ``) {
            this.logger.warn(`Message content is empty`, { context: who.name, startTime });
            return false;
        }

        try {
            who.name === `bot_1`
                ? await this.speaker1.sendMessage(process.env.GROUP_CHAT_ID, content)
                : await this.speaker2.sendMessage(process.env.GROUP_CHAT_ID, content);
            this.logger.log(LogMessage.log.onTelegramMessageSend(who.name), { startTime });
            return true;

        } catch (error) {
            this.logger.error(LogMessage.error.onBotConnectionFail(who.name), { error, startTime });
            return false;
        }

    }
}
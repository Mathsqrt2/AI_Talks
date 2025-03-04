import { LogMessage } from 'apps/ai_conversation/src/constants/conversation.responses';
import { Injectable, Logger as NestLogger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { SettingsService } from '@libs/settings';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';


@Injectable()
export class TelegramGateway {

    private speaker1: TelegramBot = null;
    private speaker2: TelegramBot = null;

    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) {

        try {
            this.speaker1 = new TelegramBot(process.env.TOKEN1, { polling: true });
            this.logger.log(LogMessage.log.onBotConnected(`bot_1`));
        } catch (error) {
            this.logger.error(LogMessage.error.onBotConnectionFail(`bot_1`), error);
            this.logger.debug(error);
            this.speaker1 = null;
        }

        try {
            this.speaker2 = new TelegramBot(process.env.TOKEN2, { polling: true });
            this.logger.log(LogMessage.log.onBotConnected(`bot_2`));
        } catch (error) {
            this.logger.debug(error);
            this.logger.error(LogMessage.error.onBotConnectionFail(`bot_2`), error);
            this.speaker2 = null;
        }

    }

    public respondBy = async (who: Bot, content: string): Promise<boolean> => {

        if (!this.speaker1 || !this.speaker2) {
            this.logger.error(LogMessage.error.onBotConnectionFail(who.name));
            return false;
        }

        if (this.settings.app.state.shouldDisplayResponse) {
            NestLogger.log(content, who.name);
        }

        if (!this.settings.app.state.shouldSendToTelegram) {
            return false;
        }

        try {
            who.name === `bot_1`
                ? await this.speaker1.sendMessage(process.env.GROUP_CHAT_ID, content)
                : await this.speaker2.sendMessage(process.env.GROUP_CHAT_ID, content);
            this.logger.log(LogMessage.log.onTelegramMessageSend(who.name));
            return true;

        } catch (error) {
            this.logger.error(LogMessage.error.onBotConnectionFail(who.name), error);
            return false;
        }

    }
}
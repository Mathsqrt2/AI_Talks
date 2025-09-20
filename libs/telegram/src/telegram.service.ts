import * as TelegramBot from 'node-telegram-bot-api';
import { SettingsService } from '@libs/settings';
import { LogMessage } from '@libs/constants';
import { Injectable } from '@nestjs/common';
import { BotsEnum } from '@libs/enums';
import { Logger } from '@libs/logger';


@Injectable()
export class TelegramGateway {

    private speaker1: TelegramBot = null;
    private speaker2: TelegramBot = null;

    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) {

        const startTime: number = Date.now();
        if (process.env.TOKEN1) {
            try {
                this.speaker1 = new TelegramBot(process.env.TOKEN1, { polling: true });
                this.logger.log(LogMessage.log.onBotConnected(BotsEnum.BOT_1), { startTime });
            } catch (error) {
                this.logger.error(LogMessage.error.onBotConnectionFail(BotsEnum.BOT_1), { error, startTime });
                this.speaker1 = null;
            }
        }

        if (process.env.TOKEN2) {
            try {
                this.speaker2 = new TelegramBot(process.env.TOKEN2, { polling: true });
                this.logger.log(LogMessage.log.onBotConnected(BotsEnum.BOT_2), { startTime });
            } catch (error) {
                this.logger.error(LogMessage.error.onBotConnectionFail(BotsEnum.BOT_2), { error, startTime });
                this.speaker2 = null;
            }
        }

    }

    public async respondBy(who: BotsEnum, content: string): Promise<boolean> {

        const startTime: number = Date.now();
        if (!this.speaker1 || !this.speaker2) {
            this.logger.error(LogMessage.error.onBotConnectionFail(who), { startTime });
            return false;
        }

        if (this.settings.app.state.shouldDisplayResponse) {
            this.logger.log(content, { context: who, startTime });
        }

        if (!this.settings.app.state.shouldSendToTelegram) {
            return false;
        }

        if (content === ``) {
            this.logger.warn(LogMessage.warn.onEmptyMessage(), { context: who, startTime });
            return false;
        }

        try {
            who === BotsEnum.BOT_1
                ? await this.speaker1.sendMessage(process.env.GROUP_CHAT_ID, content)
                : await this.speaker2.sendMessage(process.env.GROUP_CHAT_ID, content);
            this.logger.log(LogMessage.log.onTelegramMessageSend(who), { startTime });
            return true;

        } catch (error) {
            this.logger.error(LogMessage.error.onBotConnectionFail(who), { error, startTime });
            return false;
        }

    }
}
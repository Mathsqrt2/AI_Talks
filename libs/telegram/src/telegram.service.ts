import { Speaker } from '@libs/types/telegram';
import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramGateway {

    private logger: Logger = new Logger(TelegramGateway.name);
    private speaker1: TelegramBot = null;
    private speaker2: TelegramBot = null;

    constructor() {

        try {
            this.speaker1 = new TelegramBot(process.env.TOKEN1, { polling: true });
            this.logger.log(`Telegram bot_1 connected successfully`);
        } catch (error) {
            this.logger.error(`Failed to connect with telegram_bot1`, error);
        }

        try {
            this.speaker1 = new TelegramBot(process.env.TOKEN2, { polling: true });
            this.logger.log(`Telegram bot_2 connected.`);
        } catch (error) {
            this.logger.error(`Failed to connect with telegram_bot2`, error);
        }

    }

    public respondBy = async (who: Speaker, content: string): Promise<boolean> => {

        if (!this.speaker1 || !this.speaker2) {
            this.logger.error(`Something went wrong with speakers.`);
            return false;
        }

        try {

            who === `bot_1`
                ? this.speaker1.sendMessage(process.env.GROUP_CHAT_ID, content)
                : this.speaker2.sendMessage(process.env.GROUP_CHAT_ID, content);

        } catch (error) {
            this.logger.error(`Failed to send message by ${who}.`, error);
            return false;
        }

    }
}
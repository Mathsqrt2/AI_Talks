import { Injectable, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramGatway {

    private logger: Logger = new Logger(TelegramGatway.name);

    private speaker1: TelegramBot;
    private speaker2: TelegramBot;

    constructor() {
        this.speaker1 = new TelegramBot(process.env.TOKEN1, { polling: true });
        this.speaker2 = new TelegramBot(process.env.TOKEN2, { polling: true });
    }

    public message1 = async (content: string): Promise<void> => {

        try {
            this.speaker1.sendMessage(process.env.GROUP_CHAT_ID, content);
            this.logger.log(`Message sent: `, content);
        } catch (err) {
            this.logger.error(`Failed to send message on telegram group.`, err);
        }

    }

    public message2 = async (content: string): Promise<void> => {

        try {
            this.speaker2.sendMessage(process.env.GROUP_CHAT_ID, content);
            this.logger.log(`Message sent: `, content);
        } catch (err) {
            this.logger.error(`Failed to send message on telegram group.`, err);
        }

    }

}
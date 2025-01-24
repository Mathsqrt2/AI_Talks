import { BotResponse, Responder, Speaker } from '../types/speaker.types';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TelegramGatway } from '../gateways/telegram.gateway';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class Speaker1Service implements Speaker {

    private responder: Responder = `speaker1`;
    private logger: Logger = new Logger(Speaker1Service.name);

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly bot: TelegramGatway,
    ) { }

    public async initializeConversation(message?: string): Promise<void> {

        const payload: BotResponse = {
            responder: this.responder,
            message: message || process.env.INITIAL_PROMPT,
        }
        this.eventEmitter.emit(`ai_talks`, payload);

        // await this.bot.message1(`-----PROMPT-RESET-----`);
        // await this.bot.message1(message || process.env.INITIAL_PROMPT);

    }

    @OnEvent(`ai_talks`, { async: true })
    private async handleMessage(
        payload: BotResponse
    ): Promise<void> {
        if (payload.responder === this.responder) return;
        await this.respondTo(payload.message);
    }


    public async respondTo(response: string): Promise<void> {
        this.eventEmitter.emit('conversation-break', 'test')
        let message: string = `Testowa odpowiedz 1`;

        const payload: BotResponse = {
            responder: this.responder,
            message,
        }
        this.logger.log(message);
        this.eventEmitter.emit(`ai_talks`, payload);
        return;
    }

}
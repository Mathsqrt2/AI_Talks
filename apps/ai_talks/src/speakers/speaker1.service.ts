import { BotResponse, InitProps, Responder, Speaker } from '../types/speaker.types';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TelegramGatway } from '../gateways/telegram.gateway';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class Speaker1Service implements Speaker {

    private readonly logger: Logger = new Logger(Speaker1Service.name);
    private readonly responder: Responder = `speaker1`;
    private messageIndex: number = 1;
    private shouldContinue: boolean = false;
    private shouldNotify: boolean = false;
    private enqueuedMessage: string = null;

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly bot: TelegramGatway,
    ) { }

    @OnEvent(`converstaion-start`, { async: true })
    private async startConversation({ botId, message }: InitProps): Promise<void> {

        this.shouldContinue = true;
        if (botId !== 1) return;

        const payload: BotResponse = {
            responder: this.responder,
            message: message || process.env.INITIAL_PROMPT,
        }

        await this.eventEmitter.emitAsync(`ai_talks`, payload);
        if (this.shouldNotify) {
            await this.bot.message1(`-----PROMPT-RESET-----`);
        }
    }

    @OnEvent(`conversation-break`)
    private async breakConversation(): Promise<void> {
        this.shouldContinue = false;
        this.enqueuedMessage = null;
        this.messageIndex = 1;
    }

    @OnEvent(`conversation-pause`)
    private async pauseConversation(): Promise<void> {
        this.shouldContinue = false;
    }

    @OnEvent(`conversation-continue`)
    private async continueConversation(): Promise<void> {
        this.shouldContinue = true;
        this.eventEmitter.emit(`ai_talks`, {
            responder: this.responder,
            message: this.enqueuedMessage
        })
        this.enqueuedMessage = null;
    }

    @OnEvent(`ai_talks`, { async: true })
    private async handleMessage(
        payload: BotResponse
    ): Promise<void> {
        if (payload.responder === this.responder || !this.shouldContinue) return;

        try {

            const message = await this.respondTo(payload.message);

            if (!this.shouldContinue) {
                this.enqueuedMessage = message;
                return;
            }

            await this.eventEmitter.emitAsync(`ai_talks`, { responder: this.responder, message });
            if (this.shouldNotify) {
                await this.bot.message1(message);
            }

            this.logger.log(`${this.messageIndex++} Message sent successfully.`);

        } catch (err) {

            this.logger.error(`Failed to generate message.`, err);
            this.eventEmitter.emit('conversation-break', {
                errMessage: `Something went wrong with ${Speaker1Service.name}`,
                lastMessage: payload.message,
                lastResponder: payload.responder,
            });

        }
    }


    public async respondTo(response: string): Promise<string> {

        let message: string = `Testowa odpowiedz 1`;


        return message;
    }

}
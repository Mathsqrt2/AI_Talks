import { BotResponse, InitProps, Responder, Speaker } from '../types/speaker.types';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TelegramGatway } from '../gateways/telegram.gateway';
import { Injectable, Logger } from '@nestjs/common';
import { Message, Ollama } from 'ollama';

@Injectable()
export class Speaker2Service implements Speaker {

    private readonly logger: Logger = new Logger(Speaker2Service.name);
    private readonly RESPONDER: Responder = `speaker2`;
    private readonly BOT_ID: number = 2;
    private readonly MAX_MESSAGES_CONTEXT = 500;
    private readonly MAX_CONTEXT_SIZE = 4000;
    private messageIndex: number = 1;
    private shouldContinue: boolean = false;
    private shouldNotify: boolean = false;
    private enqueuedMessage: string = null;
    private model: Ollama = new Ollama({ host: process.env.OLLAMA_HOST2 });
    private messages: Message[] = [
        { role: `system`, content: process.env.OLLAMA_PROMPT },
        { role: `context`, content: process.env.OLLAMA_PROMPT },
    ];
    private context: number[] = [];

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly bot: TelegramGatway,
    ) { }

    @OnEvent(`converstaion-start`, { async: true })
    private async startConversation({ botId, message }: InitProps): Promise<void> {

        this.shouldContinue = true;
        if (botId !== this.BOT_ID) return;

        const payload: BotResponse = {
            responder: this.RESPONDER,
            message: message || process.env.INITIAL_PROMPT,
        }

        await this.eventEmitter.emitAsync(`ai_talks`, payload);
        if (this.shouldNotify) {
            await this.bot.message2(`-----PROMPT-RESET-----`);
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
            responder: this.RESPONDER,
            message: this.enqueuedMessage
        })
        this.enqueuedMessage = null;
    }

    @OnEvent(`ai_talks`, { async: true })
    private async handleMessage(
        payload: BotResponse
    ): Promise<void> {
        if (payload.responder === this.RESPONDER || !this.shouldContinue) return;

        try {
            this.messages.push({ role: payload.responder, content: payload.message });
            const message = await this.respondTo(payload.message);

            if (!this.shouldContinue) {
                this.enqueuedMessage = message;
                return;
            }

            await this.eventEmitter.emitAsync(`ai_talks`, { responder: this.RESPONDER, message });
            if (this.shouldNotify) {
                await this.bot.message2(message);
            }

            this.logger.log(`${this.messageIndex++} Message sent successfully.`);

        } catch (err) {

            this.logger.error(`Failed to generate message.`, err);
            this.eventEmitter.emit('conversation-break', {
                errMessage: `Something went wrong with ${Speaker2Service.name}`,
                lastMessage: payload.message,
                lastResponder: payload.responder,
            });

        }
    }

    private refreshMessages = (): Message[] => {
        this.messages = this.messages.slice(-this.MAX_MESSAGES_CONTEXT);
        if (this.messageIndex % 20 === 0) {
            this.messages.push(
                { role: `system`, content: process.env.OLLAMA_PROMPT },
                { role: `context`, content: process.env.OLLAMA_PROMPT },
            )
        }
        return this.messages;
    }

    private refreshContext = (): number[] => {
        while (this.context.join(' ').length > this.MAX_CONTEXT_SIZE) {
            this.context.shift();
        }
        return this.context;
    }

    public async respondTo(response: string): Promise<string> {

        try {
            const message = await this.model.generate({
                model: `ollamus2`,
                prompt: response,
                context: this.refreshContext(),
            });

            this.context.push(...message.context);
            return message.response;

        } catch (err) {
            this.logger.error(`Failed to generate response.`);
        }

    }

    public async respondToChat(response: string): Promise<string> {

        try {
            const { message } = await this.model.chat({
                model: `ollamus`,
                messages: [...this.refreshMessages(), { role: `user`, content: response }]
            });
            return message.content;
        } catch (err) {
            this.logger.error(`Failed to generate response.`);
        }

    }

}
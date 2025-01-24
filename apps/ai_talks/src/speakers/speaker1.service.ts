import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { BotResponse, Speaker } from '../types/speaker.types';
import { TelegramGatway } from '../gateways/telegram.gateway';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class Speaker1Service implements Speaker, OnApplicationBootstrap {

    private logger: Logger = new Logger(Speaker1Service.name);

    @WebSocketServer()
    server: Server;

    @SubscribeMessage(`ai_talks`)
    public listenMessage(
        @MessageBody() body: BotResponse,
    ): Promise<void> {
        this.logger.debug(body.message)
        if (body.responder === `speaker1`) return;
        this.logger.debug('jestem tu');
        this.respond(body.message);
    }

    constructor(
        private readonly bot: TelegramGatway,
    ) { }

    public async initializeConversation(message?: string): Promise<void> {
        // await this.bot.message1(`-----PROMPT-RESET-----`);
        this.respond(message || process.env.INITIAL_PROMPT);
        // await this.bot.message1(process.env.INITIAL_PROMPT);
    }

    private async wait() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    public async respond(response: string): Promise<void> {
        await this.wait()
        let message: string = `Testowa odpowiedz 1`;

        this.logger.log(message);
        this.server.emit(`ai_talks`, { responder: `speaker1`, message })

        return;
    }

    async onApplicationBootstrap() {
        this.initializeConversation()
    }
}
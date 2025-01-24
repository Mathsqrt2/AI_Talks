import { Injectable, Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { BotResponse, Speaker } from '../types/speaker.types';
import { TelegramGatway } from '../gateways/telegram.gateway';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class Speaker2Service implements Speaker {

    private logger: Logger = new Logger(Speaker2Service.name);

    @WebSocketServer()
    server: Server;

    @SubscribeMessage(`ai_talks`)
    public listenMessage(
        @MessageBody() body: BotResponse,
    ): Promise<void> {
        this.logger.debug(body)
        if (body.responder === `speaker2`) return;
        this.logger.debug('jestem tu');
        this.respond(body.message);
    }

    constructor(
        private readonly bot: TelegramGatway,
    ) { }

    public async initializeConversation(message?: string): Promise<void> {
        // await this.bot.message1(`-----PROMPT-RESET-----`);
        await this.respond(message || process.env.INITIAL_PROMPT);
        // await this.bot.message1(process.env.INITIAL_PROMPT);
    }

    public async respond(response: string): Promise<void> {

        let message: string = `Testowa odpowiedz 1`;

        this.logger.log(message);
        this.server.emit(`ai_talks`, { responder: `speaker2`, message })
        return;
    }
}
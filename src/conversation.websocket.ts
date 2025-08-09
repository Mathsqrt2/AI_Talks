import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { EventsEnum, NamespacesEnum } from "@libs/enums";
import {
    ConnectedSocket, MessageBody, SubscribeMessage,
    WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import { MessageEventPayload } from "@libs/types";
import { Server, Socket } from "socket.io";
import { Logger } from "@libs/logger";

@WebSocketGateway({
    cors: true,
    namespace: NamespacesEnum.CONVERSATION
})
export class ConversationWebSocket {

    @WebSocketServer() private server: Server

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: Logger
    ) { }

    @OnEvent(EventsEnum.message)
    public async broadcastMessage(payload: MessageEventPayload): Promise<void> {
        this.server.emit(`message`, payload.message);
    }

    @SubscribeMessage(`inject-message`)
    public insertMessageIntoCoversation(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): string {
        return data;
    }

}
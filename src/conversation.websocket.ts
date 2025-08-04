import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { EventsEnum, NamespacesEnum } from "@libs/enums";
import { MessageEventPayload } from "@libs/types";
import { Logger } from "@libs/logger";
import { Socket } from "dgram";

@WebSocketGateway(81, { namespace: NamespacesEnum.CONVERSATION })
export class ConversationWebSocket {

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly logger: Logger
    ) { }

    @OnEvent(EventsEnum.message)
    public async broadcastMessage(payload: MessageEventPayload): Promise<void> {

    }

    @SubscribeMessage(`inject-message`)
    public insertMessageIntoCoversation(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
    ): string {
        this.logger.log(data);

        if (data.includes(`respond`)) {
            client.emit('sdasdasdasdasdasdas123')
        }

        return data;
    }

}
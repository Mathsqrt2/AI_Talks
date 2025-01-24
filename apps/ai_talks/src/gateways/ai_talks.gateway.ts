import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class MessagesGateway {

    constructor() { }

    @SubscribeMessage('newMessage')
    public handleMessage(
        @MessageBody() body: any
    ) {
        console.log(body);
    }




}
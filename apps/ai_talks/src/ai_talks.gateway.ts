import { Injectable } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(90)
export class MessagesGateway {

    constructor() { }

    @SubscribeMessage('newMessage')
    public handleMessage(
        @MessageBody() body: any
    ) {
        console.log(body);
    }


}
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class Speaker1Service implements OnApplicationBootstrap {

    constructor() { }

    public async onApplicationBootstrap() {

    }

    private connectToWebSocket() {

    }
}
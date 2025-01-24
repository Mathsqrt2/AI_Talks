import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Speaker } from '../types/speaker.types';

@Injectable()
export class Speaker1Service implements OnApplicationBootstrap, Speaker {

    constructor() { }

    public async onApplicationBootstrap() {

    }

    public connectToWebSocket(channel: string): void {

    }
}
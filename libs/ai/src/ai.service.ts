import { InjectContentPayload } from '@libs/types/conversarion';
import { Message } from '@libs/types/settings';
import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';

@Injectable()
export class AiService {

    private readonly model: Ollama = new Ollama({});

    constructor() { }

    private toggleContext = () => {

    }

    public merge = async (message1: InjectContentPayload, message2: Message): Promise<string> => {

        return new Promise((resolve) => setTimeout(() => { resolve(`works`) }, 10000));
        return ``;
    }

    public respondTo = async (message: string): Promise<string> => {

        return new Promise((resolve) => setTimeout(() => { resolve(`works`) }, 10000));
        return ``;
    }

}

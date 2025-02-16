import { InjectContentPayload } from '@libs/types/conversarion';
import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';

@Injectable()
export class AiService {

    private readonly model: Ollama = new Ollama({});

    constructor() { }

    public merge = async (message1: InjectContentPayload, message2: string): Promise<string> => {
        return ``;
    }

    public respondTo = async (message: string): Promise<string> => {
        return ``;
    }

}

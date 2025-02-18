import { InjectContentPayload } from '@libs/types/conversarion';
import { Message } from '@libs/types/settings';
import { Bot } from '@libs/types/telegram';
import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenerateResponse, Ollama, Message as OllamaMessage } from 'ollama';

@Injectable()
export class AiService {

    private readonly ollama: Ollama = new Ollama({});

    constructor(
        private readonly config: ConfigModule
    ) { }

    private toggleContext = (): OllamaMessage[] => {
        return
    }

    public merge = async (message1: InjectContentPayload, message2: Message): Promise<string> => {

        return new Promise((resolve) => setTimeout(() => { resolve(`works`) }, 10000));
        return ``;
    }

    public chatAs = async (bot: Bot): Promise<string> => {
        return ``;
    }

    public respondTo = async (message: string, asWho?: Bot): Promise<string> => {

        let model = `gemma2:9b`

        asWho && asWho.name === `bot_1`
            ? model = `gemma2:9b1`
            : model = `gemma2:9b2`;

        let modelMessage: GenerateResponse = await this.ollama.generate({ model, prompt: message })


        return modelMessage.response;
    }

}

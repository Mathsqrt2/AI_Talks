import { InjectContentPayload } from '@libs/types/conversarion';
import { Message } from '@libs/types/settings';
import { Bot } from '@libs/types/telegram';
import { Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GenerateResponse, Ollama, Message as OllamaMessage } from 'ollama';

@Injectable()
export class AiService {

    private readonly ollama: Ollama = new Ollama({ host: process.env.OLLAMA_HOST1 });

    constructor(
        private readonly config: ConfigModule
    ) { }

    private toggleContext = (): OllamaMessage[] => {
        return
    }

    public merge = async (message1: InjectContentPayload, message2: Message): Promise<string> => {


        return new Promise((resolve) => setTimeout(() => { resolve(`works`) }, 10000));
    }

    public chatAs = async (bot: Bot): Promise<string> => {

        let model = bot.name === `bot_1`
            ? `deepseek-r1:8b_person1`
            : `deepseek-r1:8b_person2`;

        let modelMessage = await this.ollama.chat({ model, })
        return ``;
    }

    public respondTo = async (message: string, asWho?: Bot): Promise<string> => {

        let model = `deepseek-r1:8b`;

        asWho && asWho.name === `bot_1`
            ? model = `deepseek-r1:8b_prompt1`
            : model = `deepseek-r1:8b_prompt2`;

        let modelMessage: GenerateResponse = await this.ollama.generate({ model, prompt: message })


        return modelMessage.response;
    }

}

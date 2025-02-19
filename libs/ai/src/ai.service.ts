import { Logger } from '@libs/logger';
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
        private readonly logger: Logger,
        private readonly config: ConfigModule,
    ) { }

    private toggleContext = (): OllamaMessage[] => {
        return
    }

    public merge = async (message2: InjectContentPayload, message1: Message): Promise<string> => {

        let prompt: string = `${process.env.WORKER_CONTEXT}\n\n`;
        prompt += `"- message1: ${message1.content}"`;
        prompt += `"- message2: ${message2.prompt}"`;
        prompt += `"- mode: ${message2.mode}"`;

        try {
            const newContent = await this.ollama.generate({ model: `deepseek-r1:8b_merger`, prompt })
            return newContent.response;
        } catch (error) {
            this.logger.error(`Failed to merge mssages`, { error });
            return message1.content;
        }
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

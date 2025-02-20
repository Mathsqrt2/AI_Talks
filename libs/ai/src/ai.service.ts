import { Ollama, Message as OllamaMessage } from 'ollama';
import { InjectContentPayload } from '@libs/types/conversarion';
import { ConfigService } from '@libs/settings';
import { Message } from '@libs/types/settings';
import { Injectable } from '@nestjs/common';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';

@Injectable()
export class AiService {

    private readonly ollama: Ollama = new Ollama({ host: process.env.OLLAMA_HOST });
    constructor(
        private readonly config: ConfigService,
        private readonly logger: Logger,
    ) { }

    public merge = async (message2: InjectContentPayload, message1: Message): Promise<string> => {

        const model: string = `gemma2:9b_injector`;
        let prompt: string = `${process.env.WORKER_CONTEXT}\n\n`;
        prompt += `"- message1: ${message1.content}"\n\n`;
        prompt += `"- message2: ${message2.prompt}"\n\n`;
        prompt += `"- mode: ${message2.mode}"`;

        try {
            const newContent = await this.ollama.generate({ model, prompt })
            return newContent.response;
        } catch (error) {
            this.logger.error(`Failed to merge mssages`, { error });
            return message1.content;
        }
    }

    public chatAs = async (bot: Bot): Promise<string> => {

        const lastMessages = [...this.config.app.state.lastBotMessages];
        const initialMessage = lastMessages.shift();

        const messages: OllamaMessage[] = lastMessages
            .map(message => ({
                role: message.author.name === bot.name ? `assistant` : `user`,
                content: message.content,
            }));
        messages.unshift({ role: initialMessage.content, content: initialMessage.content });

        const model = bot.name === `bot_1`
            ? `gemma2:9b_speaker1`
            : `gemma2:9b_speaker2`;

        const modelResponse = await this.ollama.chat({ model, messages });
        return modelResponse.message.content;
    }

    public respondTo = async (message: Message, bot: Bot) => {

        const context: number[] = [];
        const model = bot.name === `bot_1`
            ? `gemma2:9b_speaker1`
            : `gemma2:9b_speaker2`;

        const modelResponse = await this.ollama.generate({ model, prompt: ``, context });
        return modelResponse.response;
    }
}

import { InjectContentPayload } from '@libs/types/conversarion';
import { Ollama, Message as OllamaMessage } from 'ollama';
import { SettingsService } from '@libs/settings';
import { Message } from '@libs/types/settings';
import { Injectable } from '@nestjs/common';
import { Bot } from '@libs/types/telegram';
import { Logger } from '@libs/logger';

@Injectable()
export class AiService {

    private readonly ollama: Ollama = new Ollama({ host: process.env.OLLAMA_HOST });
    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) { }

    public merge = async (message2: InjectContentPayload, message1: Message): Promise<string> => {

        this.settings.app.state.isGeneratingOnAir = true;
        const model: string = `gemma2:9b_injector`;
        let prompt: string = `${process.env.WORKER_CONTEXT}\n\n`;
        prompt += `"- message1: ${message1.content}"\n\n`;
        prompt += `"- message2: ${message2.prompt}"\n\n`;
        prompt += `"- mode: ${message2.mode}"`;

        try {

            const newContent = await this.ollama.generate({ model, prompt })
            this.settings.app.state.isGeneratingOnAir = false;
            return newContent.response;

        } catch (error) {

            this.logger.error(`Failed to merge mssages`, { error, save: true });
            this.settings.app.state.isGeneratingOnAir = false;
            return message1.content;

        }
    }

    public chatAs = async (bot: Bot): Promise<string> => {

        this.settings.app.state.isGeneratingOnAir = true;
        const lastMessages = [...this.settings.app.state.lastBotMessages];
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
        this.settings.app.state.isGeneratingOnAir = false;
        return modelResponse.message.content;
    }

    public respondTo = async (message: Message, bot: Bot): Promise<string> => {

        const context: number[] = [];
        const model = bot.name === `bot_1`
            ? `gemma2:9b_speaker1`
            : `gemma2:9b_speaker2`;

        const modelResponse = await this.ollama.generate({ model, prompt: ``, context });
        return modelResponse.response;
    }

    public summarize = async (): Promise<string> => {

        this.settings.app.state.isGeneratingOnAir = true;
        const model: string = `gemma2:9b_summarizer`;

        let prompt: string = `${process.env.SUMMARIZER_CONTEXT}\n`
        prompt += this.settings.app.state.lastBotMessages
            .map((message, index) => (`${index}) ${message.author.name}: "${message.content}"`)).join(`\n`);

        try {

            const summary = await this.ollama.generate({ model, prompt });
            this.settings.app.state.isGeneratingOnAir = false;
            return summary.response;

        } catch (error) {

            this.logger.error(`Failed to summarize.`, { error, save: true });
            this.settings.app.state.isGeneratingOnAir = false;
            throw error;

        }
    }
}

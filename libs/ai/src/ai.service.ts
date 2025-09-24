import { InjectContentPayload, Message } from '@libs/types';
import { Ollama, Message as OllamaMessage } from 'ollama';
import { prompts } from '@libs/constants/prompts';
import { SettingsService } from '@libs/settings';
import { LogMessage } from '@libs/constants';
import { Injectable } from '@nestjs/common';
import { BotsEnum } from '@libs/enums';
import { Logger } from '@libs/logger';

@Injectable()
export class AiService {

    private readonly ollama: Ollama = new Ollama({ host: process.env.OLLAMA_HOST });
    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) { }

    public async merge(message2: InjectContentPayload, message1: Message): Promise<string> {

        const startTime: number = Date.now();
        this.settings.app.state.isGeneratingOnAir = true;
        const model: string = `${process.env.MODEL}_injector`;
        let prompt: string = `${prompts.injectorPrompt}\n\n`;
        prompt += `"- message1: ${message1?.content}"\n\n`;
        prompt += `"- message2: ${message2?.prompt}"\n\n`;
        prompt += `"- mode: ${message2?.mode}"`;

        try {

            const newContent = await this.ollama.generate({ model, prompt })
            return newContent.response;

        } catch (error) {

            this.logger.error(LogMessage.error.onMergeMessagesFail(this.settings.app.conversationName), { error, startTime });
            return message1?.content;

        } finally {

            this.settings.app.state.isGeneratingOnAir = false;

        }
    }

    public async chatAs(bot: BotsEnum): Promise<string> {

        const startTime: number = Date.now();
        this.settings.app.state.isGeneratingOnAir = true;
        const lastMessages = structuredClone(this.settings.app.state.lastBotMessages);
        const initialMessage = lastMessages.shift();

        const messages: OllamaMessage[] = lastMessages
            .map(message => ({
                role: message.author === bot ? `assistant` : `user`,
                content: message.content,
            }));
        messages.unshift({ role: initialMessage.author, content: initialMessage.content });

        try {

            const model = bot === BotsEnum.BOT_1
                ? `${process.env.LANGUAGE?.toLowerCase()}_${process.env.MODEL}_speaker1`
                : `${process.env.LANGUAGE?.toLowerCase()}_${process.env.MODEL}_speaker2`;

            const modelResponse = await this.ollama.chat({ model, messages });
            this.settings.app.state.isGeneratingOnAir = false;
            return modelResponse.message?.content;

        } catch (error) {

            this.logger.error(LogMessage.error.onChatAsFail(bot), { error, startTime });
            throw error;

        } finally {

            this.settings.app.state.isGeneratingOnAir = false;

        }
    }

    public async summarize(): Promise<string> {

        const startTime: number = Date.now();
        this.settings.app.state.isGeneratingOnAir = true;
        const model: string = `${process.env.LANGUAGE?.toLowerCase()}_${process.env.MODEL}_summarizer`;

        let prompt: string = `${process.env.SUMMARIZER_CONTEXT}\n`
        prompt += this.settings.app.state.lastBotMessages
            .map((message, index) => (`${index}) ${message.author}: "${message?.content}"`)).join(`\n`);

        try {

            const summary = await this.ollama.generate({ model, prompt });
            return summary.response;

        } catch (error) {

            this.logger.error(LogMessage.error.onCreateSummaryFail(this.settings.app.conversationName), { error, startTime });
            throw error;

        } finally {

            this.settings.app.state.isGeneratingOnAir = false;

        }
    }

}
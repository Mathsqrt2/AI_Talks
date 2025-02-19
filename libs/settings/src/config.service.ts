import { Archive, Message, SettingsFile, Stats, StatsProperties } from '@libs/types/settings';
import { LogMessage } from 'apps/ai_conversation/src/constants/conversation.responses';
import { event } from 'apps/ai_conversation/src/constants/conversation.constants';
import { MessageEventPayload } from '@libs/types/conversarion';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Bot } from '@libs/types/telegram';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ConfigService {

    private readonly logger: Logger = new Logger(ConfigService.name);
    constructor() { }

    public app: SettingsFile = {
        conversationName: null,
        isConversationInProgres: false,
        maxMessagesCount: 100,
        maxContextSize: 4096,
        state: {
            shouldContinue: false,
            shouldSendToTelegram: true,
            shouldDisplayResponse: false,
            shouldLog: true,
            lastResponder: null,
            enqueuedMessage: null,
            usersMessagesStackForBot1: [],
            usersMessagesStackForBot2: [],
            lastBotMessages: [],
            currentMessageIndex: 0,
        },
        prompts: {
            initialPrompt: process.env.INITIAL_PROMPT,
            contextPrompt: process.env.OLLAMA_PROMPT,
            contextPrompt1: process.env.OLLAMA_PROMPT1,
            contextPrompt2: process.env.OLLAMA_PROMPT2,
        }
    };

    @OnEvent(event.message)
    private insertMessageIntoStats(payload: MessageEventPayload) {
        payload.message.author.name === `bot_1`
            ? this.stats.bot_1.messages.push(payload.message)
            : this.stats.bot_2.messages.push(payload.message);

        if (this.app.state.shouldLog) {
            this.logger.log(LogMessage.log.onSuccessfullyInsertedMessage(this.app.state.currentMessageIndex));
        }
    }

    @OnEvent(event.startConversation)
    private onStartConversation() {
        this.stats.startTime = new Date();
    }

    private stats: Archive = {
        startTime: null,
        pause: [],
        resume: [],
        bot_1: {
            messages: [],
        },
        bot_2: {
            messages: [],
        }
    }

    public noticeInterrupt = (type: `pause` | `resume`): void => {
        this.stats[type].push(new Date())
    }

    private archiveCurrentState = async (): Promise<void> => {

        const outPath = path.join(__dirname, `${this.app.conversationName}.json`);
        const data = {
            stats: this.getStats(),
            settings: this.app,
        }

        try {
            await fs.writeFile(outPath, JSON.stringify(data));
        } catch (error) {
            this.logger.error(LogMessage.error.onLocalFileSaveFail(), { error });
            throw error
        }

    }

    private findAverageTime = (messages: Message[]): number => {
        return messages.length > 0
            ? +Number(this.findTotalTime(messages) / messages.length).toFixed(1)
            : 0;
    }

    private findTotalTime = (messages: Message[]): number => {
        return messages.reduce((total, entry) => total + entry.generationTime, 0);
    }

    public getStats = (who?: Bot): Stats | StatsProperties => {

        const bot1Messages = this.stats.bot_1.messages;
        const bot2Messages = this.stats.bot_2.messages;

        const stats: Stats = {
            bot_1: {
                messagesCount: bot1Messages.length,
                totalGenerationTime: this.findTotalTime(bot1Messages),
                averageGenerationTime: this.findAverageTime(bot1Messages),
                firstMessage: bot1Messages.at(0)?.generatingEndTime,
                lastMessage: bot1Messages.at(-1)?.generatingStartTime,
            },
            bot_2: {
                messagesCount: bot2Messages.length,
                totalGenerationTime: this.findTotalTime(bot2Messages),
                averageGenerationTime: this.findAverageTime(bot2Messages),
                firstMessage: bot2Messages.at(0)?.generatingEndTime,
                lastMessage: bot2Messages.at(-1)?.generatingStartTime,
            },
        }

        if (who && who.name === `bot_1`) return stats.bot_1;
        if (who && who.name === `bot_2`) return stats.bot_2;
        return stats;
    }

    public clearStats = async (): Promise<void> => {
        await this.archiveCurrentState()
        this.stats.bot_1.messages = [];
        this.stats.bot_2.messages = [];
    }

}

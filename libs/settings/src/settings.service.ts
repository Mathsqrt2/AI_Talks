import { Archive, Message, SettingsFile, Stats, StatsProperties } from '@libs/types/settings';
import { Bot } from '@libs/types/telegram';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { event } from 'apps/ai_conversation/src/constants/conversation.constants';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class SettingsService {

    private readonly logger: Logger = new Logger(SettingsService.name);
    constructor() { }

    public app: SettingsFile = {
        conversationName: null,
        isConversationInProgres: false,
        maxMessagesCount: 100,
        maxContextSize: 4096,
        state: {
            shouldContinue: false,
            shouldDisplay: false,
            shouldLog: true,
            enqueuedMessage: null,
            usersMessagesStack: [],
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
    private insertMessageIntoStats() {

    }

    private stats: Archive = {
        bot_1: {
            messages: [],
        },
        bot_2: {
            messages: [],
        }
    }

    public clearStats = async (): Promise<void> => {

        await this.archiveCurrentState()
        this.stats.bot_1.messages = [];
        this.stats.bot_2.messages = [];
    }

    private findAverageTime = (messages: Message[]): number => {
        return messages.length > 0
            ? +Number(this.findTotalTime(messages) / messages.length).toFixed(1)
            : 0;
    }

    private findTotalTime = (messages: Message[]): number => {
        return messages.reduce((total, entry) => total + entry.generationTime, 0);
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
            this.logger.error(``, { error });
            throw error
        }

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

}

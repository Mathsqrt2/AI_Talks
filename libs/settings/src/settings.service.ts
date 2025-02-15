import { Archive, Message, SettingsFile, Stats, StatsProperties } from '@libs/types/settings';
import { Bot } from '@libs/types/telegram';
import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class SettingsService {

    constructor() { }

    public app: BehaviorSubject<SettingsFile> = new BehaviorSubject<SettingsFile>({
        isConversationInProgres: false,
        maxMessagesCount: null,
        maxContextSize: null,
        state: {
            shouldContinue: false,
            shouldNotify: false,
            shouldDisplay: false,
            shouldLog: true,
            usersMessages: [],
            currentMessageIndex: 0,
            lastBotMessages: [],

        },
        prompts: {
            initialPrompt: process.env.INITIAL_PROMPT,
            contextPrompt: process.env.OLLAMA_PROMPT,
            contextPrompt1: process.env.OLLAMA_PROMPT1,
            contextPrompt2: process.env.OLLAMA_PROMPT2,
        }
    });

    private stats: Archive = {
        bot_1: {
            messages: [],
        },
        bot_2: {
            messages: [],
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

    private archiveCurrentState = async (): Promise<void> => {



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

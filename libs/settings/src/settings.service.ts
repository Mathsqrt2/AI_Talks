import { Archive, Message, SettingsFile, Stats, StatsProperties } from '@libs/types/settings';
import { LogMessage } from 'src/constants/conversation.responses';
import { Settings as SettingsEntity } from '@libs/database/entities/settings.entity';
import { event } from 'src/constants/conversation.constants';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { prompts } from 'src/constants/prompts';
import { MessageEventPayload } from '@libs/types/conversarion';
import { State } from '@libs/database/entities/state.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { Bot } from '@libs/types/telegram';
import { Repository } from 'typeorm';
import { SHA256 } from 'crypto-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SettingsService implements OnApplicationBootstrap {

    private readonly logger: Logger = new Logger(SettingsService.name);
    constructor(
        @InjectRepository(SettingsEntity) private readonly settings: Repository<SettingsEntity>,
        @InjectRepository(State) private readonly state: Repository<State>,
    ) { }

    public app: SettingsFile = {
        conversationName: null,
        conversationId: null,
        isConversationInProgres: false,
        maxMessagesCount: 64,
        maxContextSize: 4096,
        maxAttempts: 10,
        retryAfterTimeInMiliseconds: 10000,
        state: {
            shouldArchiveLog: true,
            shouldContinue: false,
            shouldSendToTelegram: false,
            shouldDisplayResponse: false,
            shouldLog: true,
            lastResponder: null,
            enqueuedMessage: null,
            isGeneratingOnAir: false,
            usersMessagesStackForBot1: [],
            usersMessagesStackForBot2: [],
            lastBotMessages: [],
            currentMessageIndex: 0,
        },
        prompts: {
            initialPrompt: prompts.initialPrompt,
            contextPrompt: prompts.ollamaPrompt,
            contextPrompt1: prompts.ollamaPrompt1,
            contextPrompt2: prompts.ollamaPrompt2,
            summarizerPrompt: prompts.summarizerPrompt,
            injectorPrompt: prompts.injectorPrompt,

        }
    };

    public async onApplicationBootstrap() {

        const previousSettings = await this.settings.findOne({ where: {}, order: { id: `desc` } });
        if (!previousSettings) {
            await this.archiveSettings();
            return;
        }

        if (previousSettings?.maxMessagesCount) {
            this.app.maxMessagesCount = previousSettings.maxMessagesCount;
        }

        if (previousSettings?.maxContextSize) {
            this.app.maxContextSize = previousSettings.maxContextSize;
        }

        if (previousSettings?.maxAttempts) {
            this.app.maxAttempts = previousSettings.maxAttempts;
        }

        if (previousSettings?.retryAfterTimeInMiliseconds) {
            this.app.retryAfterTimeInMiliseconds = previousSettings.retryAfterTimeInMiliseconds;
        }

    }

    private prepareComparableSettingsString = (settings: SettingsEntity): string => {
        let output: string = ``;
        output += settings?.retryAfterTimeInMiliseconds ?? `noRetryTime`;
        output += settings?.maxAttempts ?? `noMaxAttempts`;
        output += settings?.maxContextSize ?? `noMaxContext`;
        output += settings?.maxMessagesCount ?? `noMaxMessagesCount`;
        return output;
    }

    private areSettingsEqual = (previous: SettingsEntity, current: SettingsEntity): boolean => {
        const previousSettingsHash = SHA256(this.prepareComparableSettingsString(previous)).toString();
        const currentSettingsHash = SHA256(this.prepareComparableSettingsString(current)).toString();
        return previousSettingsHash === currentSettingsHash
    }

    private findCurrentSettings = (): SettingsEntity => {
        return {
            id: null,
            conversationId: this.app?.conversationId || null,
            assignedConversation: null,
            maxMessagesCount: this.app?.maxMessagesCount || null,
            maxContextSize: this.app?.maxContextSize || null,
            maxAttempts: this.app?.maxAttempts || null,
            retryAfterTimeInMiliseconds: this.app?.retryAfterTimeInMiliseconds || null,
            createdAt: new Date(),
        }
    }

    public archiveSettings = async (): Promise<void> => {

        const previousSettings = await this.settings.findOne({ where: {}, order: { id: `desc` } });
        const currentSettings = this.findCurrentSettings();

        if (this.areSettingsEqual(previousSettings, currentSettings)) {
            return;
        }

        try {
            await this.settings.save(currentSettings);
        } catch (error) {
            this.logger.error(`Failed to save current settings.`);
        }
    }

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

    public archiveCurrentState = async (): Promise<void> => {

        const outPath = path.join(__dirname, `${this.app.conversationName}.${Date.now()}.json`);
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

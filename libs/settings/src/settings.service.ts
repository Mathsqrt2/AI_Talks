import {
    Injectable, InternalServerErrorException, Logger,
    NotFoundException, OnApplicationBootstrap
} from '@nestjs/common';
import { State, Settings as SettingsEntity } from '@libs/database';
import {
    Archive, Message, SettingsFile, Statistics, ModelfilesOutput,
    StatsProperties, MessageEventPayload
} from '@libs/types';
import { readdir, readFile, writeFile } from 'fs/promises';
import { BotsEnum, EventsEnum, ModelfilesEnum } from '@libs/enums';
import { LogMessage, prompts } from '@libs/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { SHA256 } from 'crypto-js';
import { resolve } from 'path';
import * as path from 'path';

@Injectable()
export class SettingsService implements OnApplicationBootstrap {

    private readonly logger: Logger = new Logger(SettingsService.name);
    constructor(
        @InjectRepository(SettingsEntity) private readonly settings: Repository<SettingsEntity>,
        @InjectRepository(State) private readonly state: Repository<State>,
    ) { }

    private modelFiles: string[] = [];

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
            shouldDisplayResponse: true,
            shouldBroadcastOnWebSocket: true,
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

        const path: string = resolve(__dirname, `..`, `modelfiles`);
        const files = await readdir(path);
        this.modelFiles = files
            .filter(modelFile => modelFile
                .endsWith(`modelfile`))
            .map(modelFile => resolve(path, modelFile));

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
        return this.settings.create({
            id: null,
            conversationId: this.app?.conversationId || null,
            assignedConversation: null,
            maxMessagesCount: this.app?.maxMessagesCount || null,
            maxContextSize: this.app?.maxContextSize || null,
            maxAttempts: this.app?.maxAttempts || null,
            retryAfterTimeInMiliseconds: this.app?.retryAfterTimeInMiliseconds || null,
            createdAt: new Date(),
        })
    }

    public archiveSettings = async (): Promise<void> => {

        const startTime: number = Date.now();
        const previousSettings = await this.settings.findOne({ where: {}, order: { id: `desc` } });
        const currentSettings = this.findCurrentSettings();

        if (this.areSettingsEqual(previousSettings, currentSettings)) {
            return;
        }

        try {
            await this.settings.save(currentSettings);
        } catch (error) {
            this.logger.error(`Failed to save current settings.`, { startTime });
        }
    }

    @OnEvent(EventsEnum.message)
    private insertMessageIntoStats(payload: MessageEventPayload) {

        const startTime: number = Date.now();
        payload.message.author === BotsEnum.BOT_1
            ? this.statistics.bot_1.messages.push(payload.message)
            : this.statistics.bot_2.messages.push(payload.message);

        if (this.app.state.shouldLog) {
            this.logger.log(LogMessage.log.onSuccessfullyInsertedMessage(this.app.state.currentMessageIndex), { startTime });
        }
    }

    @OnEvent(EventsEnum.startConversation)
    private onStartConversation() {
        this.statistics.startTime = new Date();
    }

    private statistics: Archive = {
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
        this.statistics[type].push(new Date())
    }

    public archiveCurrentState = async (): Promise<void> => {

        const startTime: number = Date.now();
        const outPath = path.join(__dirname, `${this.app.conversationName}.${Date.now()}.json`);
        const data = {
            statistics: this.getStatistics(),
            settings: this.app,
        }

        try {
            await writeFile(outPath, JSON.stringify(data));
        } catch (error) {
            this.logger.error(LogMessage.error.onLocalFileSaveFail(), { error, startTime });
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

    public getStatistics = (who?: BotsEnum): Statistics | StatsProperties => {

        const bot1Messages = this.statistics.bot_1.messages;
        const bot2Messages = this.statistics.bot_2.messages;

        const statistics: Statistics = {
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

        if (who && who === BotsEnum.BOT_1) return statistics.bot_1;
        if (who && who === BotsEnum.BOT_2) return statistics.bot_2;
        return statistics;
    }

    public clearStatistics = async (): Promise<void> => {
        await this.archiveCurrentState()
        this.statistics.bot_1.messages = [];
        this.statistics.bot_2.messages = [];
    }

    public async findModelfile(modelfile?: ModelfilesEnum): Promise<ModelfilesOutput> {

        const startTime: number = Date.now();
        if (this.modelFiles.length === 0) {
            throw new NotFoundException(`No modelfiles was found.`);
        }

        if (!modelfile) {
            try {
                let output: ModelfilesOutput = {}
                for (const modelFile of this.modelFiles) {
                    const name = modelFile.split(`.`).at(-3).split(/\/|\\/).pop();
                    output[name] = await readFile(modelFile, { encoding: `utf-8` });
                }
                return output
            } catch (error) {
                this.logger.error(`Failed to read modelfiles.`, { error, startTime });
                throw new InternalServerErrorException(`Failed to access modelfiles`)
            }
        }

        const language = process.env?.LANGUAGE?.toLowerCase();
        switch (modelfile) {
            case ModelfilesEnum.INJECTOR: return this.modelFiles.find(modelFile => modelFile.includes(`injector`) && modelFile.includes(language));
            case ModelfilesEnum.SPEAKER: return this.modelFiles.find(modelFile => modelFile.includes(`speaker`) && modelFile.includes(language));
            case ModelfilesEnum.SUMMARIZER: return this.modelFiles.find(modelFile => modelFile.includes(`summarizer`) && modelFile.includes(language));
            default:
                throw new NotFoundException(`Specified modelfile doesn't exist.`);
        }

    }

    public findLastMessage(): Message | undefined {
        return this.app.state.enqueuedMessage
            || this.app.state.lastBotMessages.at(-1)
            || {
            author: BotsEnum.BOT_1,
            content: this.app.prompts.initialPrompt,
            generatingEndTime: new Date(),
            generatingStartTime: new Date(),
            generationTime: 0,
        };
    }
}

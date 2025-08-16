import { readdir, readFile, writeFile } from 'fs/promises';
import { LogMessage, prompts } from '@libs/constants';
import { InjectRepository } from '@nestjs/typeorm';
import {
    State as StateEntity, Settings as SettingsEntity,
    Conversation, Message as MessageEntity
} from '@libs/database';
import {
    Injectable, InternalServerErrorException, Logger,
    NotFoundException, OnApplicationBootstrap
} from '@nestjs/common';
import {
    Archive, Message, SettingsFile, ModelfilesOutput,
    StatsProperties, MessageEventPayload, Statistics,
} from '@libs/types';
import {
    BotsEnum, EventsEnum, ModelfilesEnum,
    ConversationInterruptsEnum
} from '@libs/enums';
import { OnEvent } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SHA256 } from 'crypto-js';
import { resolve } from 'path';
import * as path from 'path';
import { RestorableSettingsEnum } from '@libs/enums/restorable-settings.enum';
import { RestorableStateEnum } from '@libs/enums/restorable-state.enum';

@Injectable()
export class SettingsService implements OnApplicationBootstrap {

    private readonly logger: Logger = new Logger(SettingsService.name);
    constructor(
        @InjectRepository(SettingsEntity) private readonly settings: Repository<SettingsEntity>,
        @InjectRepository(Conversation) private readonly conversation: Repository<Conversation>,
        @InjectRepository(MessageEntity) private readonly message: Repository<MessageEntity>,
        @InjectRepository(StateEntity) private readonly state: Repository<StateEntity>,
    ) { }

    private modelFiles: string[] = [];

    public app: SettingsFile = {
        conversationName: null,
        conversationId: null,
        isConversationInProgress: false,
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

        for (const key of Object.values(RestorableSettingsEnum)) {
            if (previousSettings[key]) {
                this.app[key] = previousSettings[key];
            }
        }

        const previousState = await this.state.findOne({ where: {}, order: { id: `desc` } });
        for (const key of Object.values(RestorableStateEnum)) {
            if (previousState[key]) {
                this.app.state[key] = previousState[key];
            }
        }

    }

    private prepareComparableString(values: SettingsEntity | StateEntity): string {
        let output: string = ``;
        const isState = RestorableStateEnum.SHOULD_LOG in values;
        for (const key of Object.values(isState ? RestorableStateEnum : RestorableSettingsEnum)) {
            output += values[key] ?? `no${key}`;
        }
        return output;
    }

    private areEqual<T extends StateEntity | SettingsEntity>(previous: T, current: T): boolean {
        const previousSettingsHash = SHA256(this.prepareComparableString(previous)).toString();
        const currentSettingsHash = SHA256(this.prepareComparableString(current)).toString();
        return previousSettingsHash === currentSettingsHash
    }

    private findCurrentSettings(): SettingsEntity {
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

    public async archiveSettings(): Promise<void> {

        const previousSettings = await this.settings.findOne({ where: {}, order: { id: `desc` } });
        const currentSettings = this.findCurrentSettings();

        if (this.areEqual(previousSettings, currentSettings)) {
            return;
        }

        try {
            await this.settings.save(currentSettings);
            this.logger.log(LogMessage.log.onSettingsSaveSuccess(this.app.conversationId));
        } catch (error) {
            this.logger.error(LogMessage.error.onSavingSettingsFail(), error);
        }
    }

    private findCurrentState(): StateEntity {
        return this.state.create({
            conversationId: this.app.conversationId,
            shouldContinue: this.app.state.shouldContinue,
            shouldSendToTelegram: this.app.state.shouldSendToTelegram,
            shouldDisplayResponse: this.app.state.shouldDisplayResponse,
            shouldBroadcastOnWebSocket: this.app.state.shouldBroadcastOnWebSocket,
            shouldArchiveLog: this.app.state.shouldArchiveLog,
            shouldLog: this.app.state.shouldLog,
            isGeneratingOnAir: this.app.state.isGeneratingOnAir,
            lastResponderName: this.app.state.lastResponder ?? null,
            enqueuedMessageContent: this.app.state.enqueuedMessage?.content ?? null,
            enqueuedMessageAuthor: this.app.state.enqueuedMessage?.author ?? null,
            currentMessageIndex: this.app.state.currentMessageIndex ?? null,
        })
    }

    public async archiveCurrentState(): Promise<void> {

        const previousState = await this.state.findOne({ where: {}, order: { id: `desc` } });
        const currentState = this.findCurrentState();
        let wasSaved = false;

        if (this.areEqual(previousState, currentState)) {
            return;
        }

        try {

            await this.state.save(currentState);
            wasSaved = true;
            this.logger.log(LogMessage.log.onStateSaveSuccess(this.app.conversationId));

        } catch (error) {
            this.logger.error(LogMessage.warn.onArchiveStateFail(), error);
        }


        if (wasSaved) {
            return;
        }

        const outPath = path.join(__dirname, `${this.app.conversationName}.${Date.now()}.json`);
        const data = {
            statistics: this.getStatistics(),
            settings: this.app,
        }

        try {
            await writeFile(outPath, JSON.stringify(data));
            this.logger.log(LogMessage.log.onLocalFileSaveSuccess());
        } catch (error) {
            this.logger.error(LogMessage.error.onLocalFileSaveFail(), error);
            throw error
        }

    }

    @OnEvent(EventsEnum.message)
    private insertMessageIntoStats(payload: MessageEventPayload) {

        payload.message.author === BotsEnum.BOT_1
            ? this.statistics.bot_1.messages.push(payload.message)
            : this.statistics.bot_2.messages.push(payload.message);

        if (this.app.state.shouldLog) {
            this.logger.log(LogMessage.log.onSuccessfullyInsertedMessage(this.app.state.currentMessageIndex));
        }
    }

    @OnEvent(EventsEnum.startConversation)
    private onStartConversation() {
        this.statistics.startTime = new Date();
    }

    public noticeInterrupt(type: ConversationInterruptsEnum): void {
        this.statistics[type].push(new Date())
    }

    private findAverageTime(messages: Message[]): number {
        return messages.length > 0
            ? +Number(this.findTotalTime(messages) / messages.length).toFixed(1)
            : 0;
    }

    private findTotalTime(messages: Message[]): number {
        return messages.reduce((total, entry) => total + entry.generationTime, 0);
    }

    public getStatistics(who?: BotsEnum): Statistics | StatsProperties {

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

    public async clearStatistics(): Promise<void> {
        await this.archiveCurrentState()
        this.statistics.bot_1.messages = [];
        this.statistics.bot_2.messages = [];
    }

    public async findModelfile(modelfile?: ModelfilesEnum): Promise<ModelfilesOutput> {

        if (this.modelFiles.length === 0) {
            throw new NotFoundException(LogMessage.error.onModelfilesNotFound());
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
                this.logger.error(LogMessage.error.onModelfilesAccessFail(), error);
                throw new InternalServerErrorException(LogMessage.error.onModelfilesAccessFail())
            }
        }

        const language = process.env?.LANGUAGE?.toLowerCase();
        switch (modelfile) {
            case ModelfilesEnum.INJECTOR: return this.modelFiles.find(modelFile => modelFile.includes(`injector`) && modelFile.includes(language));
            case ModelfilesEnum.SPEAKER: return this.modelFiles.find(modelFile => modelFile.includes(`speaker`) && modelFile.includes(language));
            case ModelfilesEnum.SUMMARIZER: return this.modelFiles.find(modelFile => modelFile.includes(`summarizer`) && modelFile.includes(language));
            default:
                throw new NotFoundException(LogMessage.error.onModelfileDoesntExist(modelfile));
        }

    }

    public findLastMessage(): Message {
        return this.app.state.enqueuedMessage
            || this.app.state.lastBotMessages.at(-1)
            || {
            author: BotsEnum.BOT_1,
            content: this.app.prompts.initialPrompt,
            generatingEndTime: new Date(),
            generatingStartTime: new Date(),
            generationTime: 0,
            uuid: uuidv4(),
        };
    }

    public restoreDefaults(): void {
        this.app = {
            conversationName: null,
            conversationId: null,
            isConversationInProgress: false,
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
        }
    }

    private applyState(state: StateEntity): void {
        this.app.state.currentMessageIndex = state.currentMessageIndex;
        this.app.state.shouldArchiveLog = state.shouldArchiveLog;
        this.app.state.shouldContinue = state.shouldContinue;
        this.app.state.shouldSendToTelegram = state.shouldSendToTelegram;
        this.app.state.shouldDisplayResponse = state.shouldDisplayResponse;
        this.app.state.shouldBroadcastOnWebSocket = state.shouldBroadcastOnWebSocket;
        this.app.state.shouldLog = state.shouldLog;
        this.app.state.isGeneratingOnAir = state.isGeneratingOnAir;
        this.app.state.enqueuedMessage = {
            content: state.enqueuedMessageContent,
            author: state.enqueuedMessageAuthor,
            generatingEndTime: null,
            generatingStartTime: null,
            generationTime: 0,
        };
        this.app.state.lastResponder = state.lastResponderName;
        this.app.state.currentMessageIndex = state.currentMessageIndex;
    }

    private applySettings(settings: SettingsEntity): void {
        this.app.maxMessagesCount = settings.maxMessagesCount;
        this.app.maxContextSize = settings.maxContextSize;
        this.app.maxAttempts = settings.maxAttempts;
        this.app.retryAfterTimeInMiliseconds = settings.retryAfterTimeInMiliseconds;
    }

    private applyMessages(messages: MessageEntity[]): void {
        this.app.state.lastBotMessages = messages.map(message => ({
            author: message.author,
            content: message.content,
            generatingEndTime: message.generatingEndTime,
            generatingStartTime: message.generatingStartTime,
            generationTime: message.generationTime,
        }));
    }

    public async applyConversationSettingsAndState(id: number | string): Promise<void> {

        const startTime: number = Date.now();
        let conversation: Conversation;

        const relations = [`comments`, `messages`, `settings`, `states`, `summaries`];
        if (Number.isNaN(+id)) {
            conversation = await this.conversation.findOne({
                where: { conversationName: id.toString() }, relations
            });
        } else {
            conversation = await this.conversation.findOne({
                where: { id: +id }, relations
            });
        }

        if (!conversation) {
            this.logger.warn(LogMessage.warn.onConversationNotFound(), { startTime });
            throw new NotFoundException(LogMessage.warn.onConversationNotFound());
        }

        this.app.conversationName = conversation.conversationName;
        this.app.conversationId = conversation.id;

        const state = await this.state.findOne({ where: { conversationId: conversation.id } });
        if (state) {
            this.applyState(state);
        }

        const settings = await this.settings.findOne({ where: { conversationId: conversation.id } });
        if (settings) {
            this.applySettings(settings);
        }

        const messages = await this.message.find({
            where: { conversationId: conversation.id },
            order: { id: `desc` },
            take: this.app.maxMessagesCount,
        });

        if (messages) {
            this.applyMessages(messages);
        }

        this.app.isConversationInProgress = true;
        this.app.state.isGeneratingOnAir = false;
        this.app.state.shouldContinue = false;
        this.app.state.lastResponder = this.app.state.lastBotMessages.at(-1).author;

        this.logger.log(LogMessage.log.onConversationSettingsApplied(this.app.conversationName));
    }
}

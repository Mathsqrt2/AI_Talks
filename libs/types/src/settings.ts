import { PromptsEnum } from "@libs/enums/prompts.enum";
import { InjectContentPayload } from "./conversarion";
import { BotsEnum } from "@libs/enums";
import { ConversationInterruptsEnum } from "@libs/enums/conversation-interrupts.enum";

export type SettingsFile = {
    conversationName: string,
    conversationId: number,
    isConversationInProgress: boolean,
    maxMessagesCount: number,
    maxContextSize: number,
    maxAttempts: number,
    retryAfterTimeInMiliseconds: number,
    state: State,
    prompts: Prompts,
}

export type Prompts = {
    [PromptsEnum.CONTEXT_PROMPT]: string,
    [PromptsEnum.CONTEXT_PROMPT_1]: string,
    [PromptsEnum.CONTEXT_PROMPT_2]: string,
    [PromptsEnum.INITIAL_PROMPT]: string,
    [PromptsEnum.INJECTOR_PROMPT]: string,
    [PromptsEnum.SUMMARIZER_PROMPT]: string,
}

export type State = {
    shouldArchiveLog: boolean,
    shouldContinue: boolean,
    shouldSendToTelegram: boolean,
    shouldDisplayResponse: boolean,
    shouldBroadcastOnWebSocket: boolean,
    shouldLog: boolean,
    isGeneratingOnAir: boolean,
    lastResponder?: BotsEnum,
    enqueuedMessage?: Message,
    usersMessagesStackForBot1: InjectContentPayload[],
    usersMessagesStackForBot2: InjectContentPayload[],
    lastBotMessages: Message[]
    currentMessageIndex: number,
}

export type AppState = {
    usersMessages: InjectContentPayload[],
    currentMessageIndex: number,
    enqueuedMessage: string;
}

export type Archive = {
    startTime: Date,
    [ConversationInterruptsEnum.PAUSE]: Date[],
    [ConversationInterruptsEnum.RESUME]: Date[],
    bot_1: { messages: Message[] },
    bot_2: { messages: Message[] },
}

export type Statistics = {
    bot_1: StatsProperties,
    bot_2: StatsProperties
};

export type StatsProperties = {
    messagesCount: number,
    totalGenerationTime: number,
    averageGenerationTime: number,
    firstMessage: Date,
    lastMessage: Date,
}

export type Message = {
    generationTime: number,
    generatingStartTime: Date,
    generatingEndTime: Date,
    content: string,
    author: BotsEnum,
    uuid: string,
}

export type ModelfilesOutput = string | { [key: string]: string };
export type PromptOutput = { prompt: string | { [key: string]: string } }
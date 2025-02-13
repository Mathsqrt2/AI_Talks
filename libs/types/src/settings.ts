import { InjectContentPayload } from "./conversarion";
import { Bot } from "./telegram";

export type SettingsFile = {
    isConversationInProgres: boolean,
    maxMessagesCount: number,
    maxContextSize: number,
    state: {
        shouldContinue: boolean,
        shouldNotify: boolean,
        shouldDisplay: boolean,
        shouldLog: boolean,
    }

    prompts: {
        initialPrompt: string;
        contextPrompt: string;
        contextPrompt1: string;
        contextPrompt2: string;
    }
}

export type AppState = {
    usersMessages: InjectContentPayload[],
    currentMessageIndex: number,
    enqueuedMessage: string;
}

export type Archive = {
    bot_1: { messages: Message[] },
    bot_2: { messages: Message[] },
}

export type Stats = {
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
}
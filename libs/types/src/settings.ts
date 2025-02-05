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
        initPrompt: string;
        contextPrompt1: string;
        contextPrompt2: string;
    }
}

export type Stats = { [key: string]: StatsProperties };

type StatsProperties = {
    messages: number,
    durationRecords: number[],
    totalGenerationTime: number,
    averageGenerationTime: number,
}
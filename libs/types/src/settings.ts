export type SettingsFile = {
    maxContextSize: number,
    maxMessagesCount: number,
    isConversationInProgres: boolean,
    areNotificationsEnabled: boolean,
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
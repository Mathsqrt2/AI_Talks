import { LogMessages } from "@libs/types/logs";

export const logMessages: LogMessages = {
    warn: {
        conversationAlreadyRunning: () => `Failed to create a new conversation. There is already one in progress.`,
    },
    error: {

    },
    log: {
        contextUpdated: (contextLength?: number) => `Context updated successfully.${contextLength ? ` New valuie: ${contextLength}` : ``}`,
    }
}
import { LogMessages } from "@libs/types/logs";

export const logMessages: LogMessages = {
    warn: {
        onConversationAlreadyRunning: () => `Failed to create a new conversation. There is already one in progress.`,
    },
    error: {
        onIdOutOfRange: (id?: number) => `Failed to start conversation.${id ? `Bot with ID ${id} doesn't exist.` : ``}`,
    },
    log: {
        onContextUpdated: (contextLength?: number) => `Context updated successfully.${contextLength ? ` New valuie: ${contextLength}` : ``}`,
        onConversationStart: () => `Conversation initialized.`,
    }
}
import { LogMessages } from "@libs/types/logs";

export const logMessages: LogMessages = {
    warn: {
        onConversationAlreadyRunning: () => `Failed to create a new conversation. There is already one in progress.`,
        onIdOutOfRange: (id?: number) => `Failed to start conversation.${id ? `Bot with ID ${id} doesn't exist.` : ``}`,
        onBreakMissingConversation: () => `Failed to break. There are no currently processed talks.`,
        onPauseMissingConversation: () => `Failed to pause. Currently there are no processed talks.`,
        onResumeMissingConversation: () => `Failed to continue. Currently there are no processed talks.`,
        onInvalidPayload: () => `Failed to inject content. Invalid payload.`,
        onInvalidMode: (mode?: string) => `Failed to inject message. Incorrect mode${mode ? ` "${mode}"` : ``}`,
    },
    error: {
        onConversationInitFail: () => `Failed to initialize conversation.`,
    },
    log: {
        onContextUpdated: (contextLength?: number) => `Context updated successfully.${contextLength ? ` New valuie: ${contextLength}` : ``}`,
        onConversationStart: () => `Conversation initialized.`,
        onBreakConversation: () => `Successfully broke the current conversation.`,
        onPauseConversation: () => `Successfully paused current conversation.`,
        onResumeConversation: () => `Successfully resumed current conversation.`,
        onInjectMessage: () => `Successfully injected outer message into conversation.`,
    }
}
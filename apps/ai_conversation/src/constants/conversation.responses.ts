import { LogMessageContent } from "@libs/types/logs";

export class LogMessage {

    public static warn: LogMessageContent = {
        onConversationAlreadyRunning: (): string => `Failed to create a new conversation. There is already one in progress.`,
        onIdOutOfRange: (id?: number): string => `Failed to start conversation.${id ? `Bot with ID ${id} doesn't exist.` : ``}`,
        onBreakMissingConversation: (): string => `Failed to break. There are no currently processed talks.`,
        onPauseMissingConversation: (): string => `Failed to pause. Currently there are no processed talks.`,
        onResumeMissingConversation: (): string => `Failed to continue. Currently there are no processed talks.`,
        onInvalidPayload: (): string => `Failed to inject content. Invalid payload.`,
        onInvalidMode: (mode?: string) => `Failed to inject message. Incorrect mode${mode ? ` "${mode}"` : ``}`,
    };

    public static error: LogMessageContent = {
        onConversationInitFail: (): string => `Failed to initialize conversation.`,
    };

    public static log: LogMessageContent = {
        onContextUpdated: (contextLength?: number): string => `Context updated successfully.${contextLength ? ` New valuie: ${contextLength}` : ``}`,
        onConversationStart: (): string => `Conversation initialized.`,
        onBreakConversation: (): string => `Successfully broke the current conversation.`,
        onPauseConversation: (): string => `Successfully paused current conversation.`,
        onResumeConversation: (): string => `Successfully resumed current conversation.`,
        onInjectMessage: (): string => `Successfully injected outer message into conversation.`,
    };

}
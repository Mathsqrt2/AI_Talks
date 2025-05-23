import { LogMessageContent } from "@libs/types/logs";
export class LogMessage {

    public static warn: LogMessageContent = {
        onConversationAlreadyRunning: (): string => `Failed to create a new conversation. There is already one in progress.`,
        onIdOutOfRange: (id?: number): string => `Failed to start conversation.${id ? `Bot with ID ${id} doesn't exist.` : ``}`,
        onBreakMissingConversation: (): string => `Failed to break. There are no currently processed talks.`,
        onPauseMissingConversation: (): string => `Failed to pause. Currently there are no processed talks.`,
        onResumeMissingConversation: (): string => `Failed to continue. Currently there are no processed talks.`,
        onInvalidPayload: (): string => `Failed to inject content. Invalid payload.`,
        onInvalidMode: (mode?: string) => `Failed to inject message. Incorrect mode${mode ? ` "${mode}"` : ``}.`,
        onConversationInterrupt: (): string => `Conversation is currently paused.`,
        onInitializationFail: (): string => `Failed to initialize new conversation.`,
    };

    public static error: LogMessageContent = {
        onConversationInitFail: (): string => `Failed to initialize conversation.`,
        onResumeConversationFail: (): string => `An internal error occurred during the conversation initialization.`,
        onFailedToResponseWithPrompt: (): string => `Failed to response with prompt. ID out of range`,
        onIncorrectValue: (property: string) => `Incorrect ${property} value.`,
        onNaNError: (property: string) => `${property.charAt(0).toUpperCase()}${property.slice(1)} value must be a number.`,
        onInvalidBody: (): string => `Invalid body params.`,
        onBotConnectionFail: (name: string): string => `Failed to connect with Telegram "${name}".`,
        onBotAccessFail: (name: string): string => `Failed to access "${name}" on Telegram.`,
        onInvalidTelegramBot: (): string => `Something went wrong with speakers.`,
        onSendBotMessageFail: (who: string) => `Failed to send message by ${who}.`,
        onLocalFileSaveFail: (): string => `Failed to save application state in local copy.`,
        onSaveLogFail: (type: string) => `Failed to save ${type} log in database.`,
        onMessageAfterConversationBreak: (): string => `Failed to continue. Current conversation doesn't exist.`,
        onDeliveryFail: (): string => `Failed to delivery LLM response.`,
        onRetryFail: (): string => `Failed to delivery message. App state saved.`,
        onGenerateMessageFail: (): string => `Failed to generate response.`,
        onGenerateRetryFail: (): string => `Failed to generate response too many times. App state saved.`,
        onSummaryGenerationFail: (): string => `Failed to generate summary.`,
        onUndefinedParam: (param: string): string => `Property ${param} doesn't exist in state.`,
        onSaveConversationNameFail: (name: string) => `Failed to save conversation ${name} in database.`,
        onMergeMessagesFail: (name: string): string => `Failed to merge mssages in ${name}.`,
        onCreateSummaryFail: (name: string): string => `Failed to summarize conversation ${name}.`,
        onDatabaseConnectionFail: (): string => `Failed to initalize database connection.`,
        onSummarizeFail: (): string => `Failed to summarize conversation.`,
    };

    public static log: LogMessageContent = {
        onContextUpdated: (contextLength?: number): string => `Context updated successfully.${contextLength ? ` New valuie: ${contextLength}` : ``}`,
        onConversationStart: (): string => `Conversation initialized.`,
        onBreakConversation: (name?: string): string => `Successfully broken the current conversation.${name ? ` ID: ${name}` : ``}`,
        onPauseConversation: (): string => `Successfully paused current conversation.`,
        onResumeConversation: (): string => `Successfully resumed current conversation.`,
        onInjectMessage: (): string => `Successfully pushed external message into user messages stack.`,
        onUserResponseWithConfig: (): string => `Responded to user with current app configuration`,
        onUserResponseWithContext: (): string => `Responded to user with current context length.`,
        onUserResponseWithPrompt: (type: string): string => `Responded to user with ${type} prompt.`,
        onUserResponseWithAllPrompts: (): string => `Responded to user with all prompts.`,
        onBotConnected: (name: string) => `${name} connected successfully.`,
        onSuccessfullyInsertedMessage: (id: number): string => `Message ${id} successfully archived.`,
        onTelegramMessageSend: (name: string): string => `Message send to the telegram channel by ${name}.`,
        onMessageEmission: (id: number): string => `Message ${id} emitted successfully.`,
        onParamResponse: (param: string): string => `Responded with ${param} value`,
        onApplicationBootstrap: (): string => `Application launched successfully.`,
    };

}
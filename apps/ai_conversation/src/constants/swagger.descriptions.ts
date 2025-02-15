import { LogMessageContent } from "@libs/types/logs"

export class SwaggerMessages {

    public static description: LogMessageContent = {
        apiRoute: (): string => `api`,
        appVersion: (): string => `3.0`,
        appTitle: (): string => `AI Talks`,
        appHeadingTitle: (): string => `AI Talks Documentation`,
        appDescription: (): string => `The application initializes a conversation between two language models, whose task is to engage in continuous dialogue with each other. The goal of this experiment is to stimulate the emergence of interesting digressions between the models. This API enables dynamic management of the application's settings via HTTP requests.`,
    }

    public static init: LogMessageContent = {
        aboutIdParam: (): string => `Speaker identifier (1 or 2). Determines which speaker to start the conversation with.`,
        aboutAcceptedResponse: (): string => `Returned when the conversation is successfully initialized.`,
        aboutForbiddenResponse: (): string => `A conversation is already in progress and cannot be initialized again.`,
        aboutBadRequestResponse: (): string => `Invalid 'id' parameter. Allowed values are 1 or 2.`,
        aboutInternalServerError: (): string => `An internal error occurred during the conversation initialization.`,
    }

    public static pause: LogMessageContent = {
        aboutBadRequestResponse: (): string => `No active conversation to pause.`,
        aboutOkResponse: (): string => `Conversation successfully paused.`,
    }

    public static resume: LogMessageContent = {
        aboutBadRequestResponse: (): string => `No active conversation to resume.`,
        aboutOkResponse: (): string => `Conversation successfully resumed.`,
        aboutInternalServerError: (): string => `An internal error occurred during the conversation pause.`,
    }

    public static break: LogMessageContent = {
        aboutBadRequestResponse: (): string => `No active conversation to break.`,
        aboutOkResponse: (): string => `Conversation successfully ended.`,
    }

    public static inject: LogMessageContent = {
        aboutBadRequestResponse: (): string => `No request body provided or invalid 'mode'. Only 'REPLACE' and 'MERGE' are allowed.`,
        aboutAcceptedResponse: (): string => `Content successfully injected in the conversation.`,
    }

    public static injectMessageDto: LogMessageContent = {
        promptDescription: (): string => `A text message to be injected or merged into the conversation.`,
        modeDescription: (): string => `Defines how the new content will be integrated (MERGE or INJECT).`,
        botIdDescription: (): string => `Specifies the ID of the bot (must be 1 or 2).`,
        usernameDescription: (): string => `The username of the person triggering the injection.`,
    }

    public static conversationInitDto: LogMessageContent = {
        promptDescription: (): string => `A text message to be used as initial prompt.`
    }

    public static example: LogMessageContent = {
    }

}
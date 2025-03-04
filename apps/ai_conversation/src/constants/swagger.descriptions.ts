import { LogMessageContent } from "@libs/types/logs"
import { ApiAcceptedResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger"

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
        modeDescription: (): string => `Defines how the new content will be integrated (MERGE or REPLACE).`,
        botIdDescription: (): string => `Specifies the ID of the bot (must be 1 or 2).`,
        usernameDescription: (): string => `The username of the person triggering the injection.`,
    }

    public static conversationInitDto: LogMessageContent | any = {
        examples: {
            example1: {
                description: `A text message to be used as initial prompt.`,
                value: `What do you think about astronomy?`,
            },
        },
        promptDescription: (): string => `A text message to be used as initial prompt.`,
        promptExample: (): string => `What do you think about astronomy?`,
    }

    public static responseInjectDto: LogMessageContent = {
        promptDescription: (): string => `The content or message to be injected into the conversation.`,
        modeDescription: (): string => `Specifies how the new content should be integrated (e.g., MERGE or REPLACE).`,
        botIdDescription: (): string => `Indicates the ID of the bot to which the content is directed.`,
        usernameDescription: (): string => `The username of the person requesting the content injection.`,
    }

    public static responseMessageDto: LogMessageContent = {
        generationTimeDescription: (): string => `Duration of the message generation process (in milliseconds).`,
        generatingStartTimeDescription: (): string => `Timestamp indicating when the message generation started.`,
        generatingEndTimeDescription: (): string => `Timestamp indicating when the message generation ended.`,
        contentDescription: (): string => `The textual content of the generated message.`,
        authorDescription: (): string => `Identifies who authored or created the message.`,
    }

    public static responsePromptsDto: LogMessageContent = {
        initialPromptDescription: (): string => `The initial prompt used to start the conversation flow.`,
        contextPromptDescription: (): string => `An additional prompt providing context or guidance during the conversation.`,
        contextPrompt1Description: (): string => `A supplementary context prompt to offer more detailed instructions.`,
        contextPrompt2Description: (): string => `Another context prompt delivering extra details or constraints.`,

    }

    public static responseSettingsDto: LogMessageContent = {
        conversationNameDescription: (): string => `The name assigned to the current conversation or session.`,
        isConversationInProgressDescription: (): string => `Indicates whether the conversation is currently active.`,
        maxMessagesCountDescription: (): string => `Maximum number of messages allowed within this conversation.`,
        maxContextSizeDescription: (): string => `Defines the maximum context size for the conversation's memory usage.`,
        stateDescription: (): string => `Contains the current state of the conversation, including flags and indices.`,
        promptsDescription: (): string => `Holds the conversation's prompts or predefined messages for guiding the discussion flow.`,
    }

    public static responseStateDto: LogMessageContent = {
        shouldContinueDescription: (): string => `Indicates whether the conversation should continue after processing the current message.`,
        shouldDisplayDescription: (): string => `Determines if the conversation output should be sent to the telegram chat.`,
        shouldLogDescription: (): string => `Specifies whether the conversation exchanges should be logged for further reference.`,
        enqueuedMessageDescription: (): string => `A bot message waiting to conversation resume.`,
        usersMessagesStackDescription: (): string => `A stack of user-provided messages awaiting processing in the conversation flow.`,
        currentMessageIndexDescription: (): string => `Tracks the index of the current message in the ongoing conversation.`,
        lastBotMessagesDescription: (): string => `A list of the most recent bot messages to maintain context or for replay.`,
        lastBotMessagesExample: (): string => `A list of the most recent bot messages to maintain context or for replay.`,
    }

    public static summaryGeneration: LogMessageContent = {
        aboutAcceptedResponse: (): string => `Returns summary as text when it is generated successfully`,
        aboutInternalServerError: (): string => `An internal error occurred during the conversation summarizing.`,
    }

    public static findCurrentSettings: LogMessageContent = {
        ApiFoundResponse: (): string => `Returns the current conversation settings if found.`,
    }

    public static findCurrentContextLength: LogMessageContent = {
        ApiFoundResponse: (): string => `Returns the current maximum context size for the conversation.`,
    }

    public static findCurrentPrompt: LogMessageContent = {
        ApiFoundResponse: (): string => `Returns the current prompt(s) based on the provided 'id'. If 'id' is 0, 1, 2, or 3, a specific prompt is returned; if omitted, all prompts are returned.`,
        ApiBadRequestResponse: (): string => `Invalid 'id' parameter. Acceptable values: 0 (initialPrompt), 1 (contextPrompt1), 2 (contextPrompt2), or 3 (contextPrompt).`,
    }

}
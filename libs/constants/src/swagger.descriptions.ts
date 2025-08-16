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
        modeDescription: (): string => `Defines how the new content will be integrated (MERGE or REPLACE).`,
        botIdDescription: (): string => `Specifies the ID of the bot (must be 1 or 2).`,
        usernameDescription: (): string => `The username of the person triggering the injection.`,
    }

    public static modelfileDto: LogMessageContent = {
        aboutId: (): string => `Model file identifier (0: injector, 1: speaker, 2: summarizer)`,
    }

    public static promptDto: LogMessageContent = {
        aboutId: (): string => `Prompt identifier (0: initial, 1-2: context, 3: conversation, 4-5: custom)`
    }

    public static InvitationDto: LogMessageContent = {
        responseInvitation: (): string => `Telegram group invitation link for accessing the conversation chat.`
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

    public static injectDto: LogMessageContent = {
        promptDescription: (): string => `The content or message to be injected into the conversation.`,
        modeDescription: (): string => `Specifies how the new content should be integrated (e.g., MERGE or REPLACE).`,
        botIdDescription: (): string => `Indicates the ID of the bot to which the content is directed.`,
        usernameDescription: (): string => `The username of the person requesting the content injection.`,
    }

    public static messageDto: LogMessageContent = {
        generationTimeDescription: (): string => `Duration of the message generation process (in milliseconds).`,
        generatingStartTimeDescription: (): string => `Timestamp indicating when the message generation started.`,
        generatingEndTimeDescription: (): string => `Timestamp indicating when the message generation ended.`,
        contentDescription: (): string => `The textual content of the generated message.`,
        authorDescription: (): string => `Identifies who authored or created the message.`,
        uuidDescription: (): string => `Universally unique identifier for the message.`,
    }

    public static promptsDto: LogMessageContent = {
        initialPromptDescription: (): string => `The initial prompt used to start the conversation flow.`,
        contextPromptDescription: (): string => `An additional prompt providing context or guidance during the conversation.`,
        contextPrompt1Description: (): string => `A supplementary context prompt to offer more detailed instructions.`,
        contextPrompt2Description: (): string => `Another context prompt delivering extra details or constraints.`,
        injectorPromptDescription: (): string => `A prompt used to inject specific content or instructions into the conversation.`,
        summarizerPromptDescription: (): string => `A prompt used to summarize the conversation or key points discussed.`,
    }

    public static settingsDto: LogMessageContent = {
        conversationNameDescription: (): string => `The name assigned to the current conversation or session.`,
        conversationIdDescription: (): string => `Unique identifier for the conversation, used for tracking and management.`,
        isConversationInProgresssDescription: (): string => `Indicates whether the conversation is currently active.`,
        maxMessagesCountDescription: (): string => `Maximum number of messages allowed within this conversation.`,
        maxContextSizeDescription: (): string => `Defines the maximum context size for the conversation's memory usage.`,
        maxAttemptsDescription: (): string => `The maximum number of attempts allowed for generating a response in the conversation.`,
        retryAfterTimeInMilisecondsDescription: (): string => `Time in milliseconds to wait before retrying a failed operation in the conversation.`,
        stateDescription: (): string => `Contains the current state of the conversation, including flags and indices.`,
        promptsDescription: (): string => `Holds the conversation's prompts or predefined messages for guiding the discussion flow.`,
    }

    public static stateDto: LogMessageContent = {
        shouldArchiveLogDescription: (): string => `Indicates whether the conversation log should be archived in the database.`,
        shouldContinueDescription: (): string => `Indicates whether the conversation should continue after processing the current message.`,
        shouldDisplayDescription: (): string => `Determines if the conversation output should be sent to the telegram chat.`,
        shouldSendToTelegramDescription: (): string => `Indicates whether the conversation output should be sent to the Telegram chat.`,
        shouldBroadcastOnWebSocketDescription: (): string => `Indicates whether the conversation output should be broadcasted on a WebSocket.`,
        shouldLogDescription: (): string => `Specifies whether the conversation exchanges should be logged for further reference.`,
        isGeneratingOnAirDescription: (): string => `Indicates whether the conversation is currently generating a response.`,
        lastResponderDescription: (): string => `Identifies the last bot that responded in the conversation.`,
        enqueuedMessageDescription: (): string => `A bot message waiting to conversation resume.`,
        usersMessagesStackDescription: (): string => `A stack of user-provided messages awaiting processing in the conversation flow.`,
        currentMessageIndexDescription: (): string => `Tracks the index of the current message in the ongoing conversation.`,
        lastBotMessagesDescription: (): string => `A list of the most recent bot messages to maintain context or for replay.`,
        lastBotMessagesExample: (): string => `A list of the most recent bot messages to maintain context or for replay.`,
        aboutParam: (): string => `State parameter to retrieve from conversation state.`,
        aboutConversationInProgress: (): string => `Flag indicating whether a conversation is currently active.`,
        aboutProperty: (): string => `The property to retrieve from settings`,
    }

    public static setPromptDto: LogMessageContent = {
        aboutPrompt: (): string => `Prompt to set for the conversation`,
    }

    public static setContextDto: LogMessageContent = {
        aboutContext: (): string => `Maximum context size for conversation memory (in tokens)`,
    }

    public static restoreConversationDto: LogMessageContent = {
        aboutPayloadId: (): string => `Conversation identifier from the provided conversation data payload`,
        aboutId: (): string => `Unique identifier of the conversation to restore`,
    }

    public static summaryGeneration: LogMessageContent = {
        aboutAcceptedResponse: (): string => `Returns summary as text when it is generated successfully`,
        aboutInternalServerError: (): string => `An internal error occurred during the conversation summarizing.`,
    }

    public static findCurrentSettings: LogMessageContent = {
        ApiOkResponse: (): string => `Returns the current conversation settings if found.`,
    }

    public static findCurrentContextLength: LogMessageContent = {
        ApiOkResponse: (): string => `Returns the current maximum context size for the conversation.`,
    }

    public static findCurrentPrompt: LogMessageContent = {
        ApiOkResponse: (): string => `Returns the current prompt(s) based on the provided 'id'. If 'id' is 0, 1, 2, or 3, a specific prompt is returned; if omitted, all prompts are returned.`,
        ApiBadRequestResponse: (): string => `Invalid 'id' parameter. Acceptable values: 0 (initialPrompt), 1 (contextPrompt1), 2 (contextPrompt2), or 3 (contextPrompt).`,
    }

    public static findCurrentState: LogMessageContent = {
        ApiOkResponse: (): string => `Returns detailed conversation state including runtime flags, message queues, and progress indicators`,
    }

    public static findSpecifiedPropertyState: LogMessageContent = {
        ApiOkResponse: (): string => `Returns the value of a specific state parameter from the current conversation state`,
    }

    public static findSpecifiedParamState: LogMessageContent = {
        ApiBadRequestResponse: (): string => `Invalid state parameter requested - parameter not found in application state`,
        ApiOkResponse: (): string => `Returns specific state parameter value from current conversation state`,
    }

    public static findTelegramInvitation: LogMessageContent = {
        ApiOkResponse: (): string => `Returns a Telegram group invitation link for joining the conversation chat`,
    }

    public static findModelFile: LogMessageContent = {
        ApiOkResponse: (): string => `Returns the content of AI model configuration files - all files if no name specified, or specific file for given name injector, speaker, summarizer)`,
        ApiNotFoundResponse: (): string => `No modelfiles found in directory or specified modelfile ID doesn't exist`,
    }

    public static setSettingsFile: LogMessageContent = {
        ApiNoContentResponse: (): string => `Successfully updated settings file`,
        ApiBadRequestResponse: (): string => `Failed to update settings file. Invalid data`,
    }

    public static setPropertyValue: LogMessageContent = {
        ApiNoContentResponse: (): string => `Successfully updated conversation property to the specified value`,
        ApiBadRequestResponse: (): string => `Failed to update conversation property. Invalid value in property`,
    }

    public static setPrompt: LogMessageContent = {
        ApiNoContentResponse: (): string => `Successfully updated prompt with the specified ID`,
        ApiBadRequestResponse: (): string => `Failed to set prompt. Invalid prompt data`,
    }

    public static setState: LogMessageContent = {
        ApiNoContentResponse: (): string => `Successfully updated conversation state`,
        ApiBadRequestResponse: (): string => `Failed to set state. Invalid state data`,
    }

    public static setStateForParam: LogMessageContent = {
        ApiNoContentResponse: (): string => `Successfully updated state for the specified parameter`,
        ApiBadRequestResponse: (): string => `Failed to set state for parameter. Invalid state data`,
    }

    public static patchState: LogMessageContent = {
        ApiNoContentResponse: (): string => `Successfully updated conversation state`,
        ApiBadRequestResponse: (): string => `Failed to patch state. Invalid state data`,
    }

    public static patchPrompts: LogMessageContent = {
        ApiNoContentResponse: (): string => `Successfully updated conversation prompts`,
        ApiBadRequestResponse: (): string => `Failed to patch prompts. Invalid prompts data`,
    }

    public static deleteConversation: LogMessageContent = {
        ApiAcceptedResponse: (): string => `Successfully deleted conversation`,
    }

    public static restoreConversation: LogMessageContent = {
        ApiAcceptedResponse: (): string => `Successfully restored conversation`,
        ApiNotFoundResponse: (): string => `Failed to restore conversation. Conversation not found`,
        ApiInternalServerErrorResponse: (): string => `Failed to restore conversation. Internal server error`,
        ApiForbiddenResponse: (): string => `Failed to restore conversation. Access denied`,
    }

    public static PatchStateDto: LogMessageContent = {
        shouldArchiveLogDescription: (): string => `Whether conversation logs should be archived in the database.`,
        shouldContinueDescription: (): string => `Whether the conversation should continue after the current message.`,
        shouldSendToTelegramDescription: (): string => `Whether to send conversation outputs to the Telegram chat.`,
        shouldDisplayResponseDescription: (): string => `Whether to display the generated response in logs`,
        shouldBroadcastOnWebSocketDescription: (): string => `Whether to broadcast conversation outputs over WebSocket.`,
        shouldLogDescription: (): string => `Whether to log conversation exchanges for auditing/debugging.`,
        isGeneratingOnAirDescription: (): string => `Whether a response is currently being generated (runtime flag).`,
        lastResponderDescription: (): string => `The last bot that responded in the conversation (enum BotsEnum).`,
        enqueuedMessageDescription: (): string => `A message queued to be processed when the conversation resumes.`,
        usersMessagesStackForBot1Description: (): string => `A FIFO/LIFO stack of user messages awaiting processing by Bot 1.`,
        usersMessagesStackForBot2Description: (): string => `A FIFO/LIFO stack of user messages awaiting processing by Bot 2.`,
        lastBotMessagesDescription: (): string => `Recent bot messages kept for short-term context/replay.`,
        currentMessageIndexDescription: (): string => `Index of the current message being processed in the conversation.`,
    };

    public static PatchPropertyDto: LogMessageContent = {
        conversationNameDescription: (): string => `The name assigned to the current conversation/session.`,
        conversationIdDescription: (): string => `Unique numeric identifier of the conversation.`,
        isConversationInProgressDescription: (): string => `Indicates whether a conversation is currently active.`,
        maxMessagesCountDescription: (): string => `Maximum number of messages allowed in the conversation.`,
        maxContextSizeDescription: (): string => `Maximum context size (e.g., tokens) used for the conversation memory.`,
        maxAttemptsDescription: (): string => `Maximum number of generation attempts per response.`,
        retryAfterTimeInMilisecondsDescription: (): string => `Delay (ms) before retrying a failed generation/operation.`,
        stateDescription: (): string => `Partial state patch object applied to the conversation runtime state.`,
        promptsDescription: (): string => `Partial prompts patch object applied to the conversation prompts.`,
    };

    public static PatchPromptsDto: LogMessageContent = {
        contextPromptDescription: (): string => `Additional context or guidance prompt for the conversation.`,
        contextPrompt1Description: (): string => `First supplementary context prompt for providing more detailed instructions.`,
        contextPrompt2Description: (): string => `Second supplementary context prompt for providing extra details or constraints.`,
        initialPromptDescription: (): string => `Initial prompt used to start the conversation.`,
        injectorPromptDescription: (): string => `Prompt used to inject specific content or instructions into the conversation.`,
        summarizerPromptDescription: (): string => `Prompt used to summarize the conversation or key points discussed.`,
    };

    public static resetConversation: LogMessageContent = {
        ApiAcceptedResponse: (): string => `Conversation reset successfully.`,
        ApiInternalServerErrorResponse: (): string => `Failed to reset conversation. Internal server error`,
    };

}
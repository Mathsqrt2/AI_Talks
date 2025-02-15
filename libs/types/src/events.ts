export type EventKeys =
    | `startConversation`
    | `breakConversation`
    | `resumeConversation`
    | `resetConversation`
    | `injectMessage`
    | `message`;

export type EventTypes =
    | `start-conversation`
    | `break-conversation`
    | `resume-conversation`
    | `reset-conversation`
    | `inject-message`
    | `message`;

export type EventPayload = {
    bot_name?: string,
    speaker_id: number,
    prompt: string,
}
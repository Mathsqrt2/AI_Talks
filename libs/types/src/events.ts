export type EventKeys =
    | `startConversation`
    | `breakConversation`
    | `resumeConversation`
    | `injectMessage`
    | `message`;

export type EventTypes =
    | `start-conversation`
    | `break-conversation`
    | `resume-conversation`
    | `inject-message`
    | `message`;

export type EventPayload = {
    bot_name?: string,
    speaker_id: number,
    prompt: string,
}
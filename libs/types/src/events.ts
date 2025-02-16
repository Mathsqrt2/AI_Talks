export type EventKeys =
    | `startConversation`
    | `breakConversation`
    | `resetConversation`
    | `injectMessage`
    | `message`;

export type EventTypes =
    | `start-conversation`
    | `break-conversation`
    | `reset-conversation`
    | `inject-message`
    | `message`;

export type InitEventPayload = {
    speaker_id: number,
    prompt: string,
}
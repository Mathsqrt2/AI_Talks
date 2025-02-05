export type EventKeys =
    | `startConversation`
    | `breakConversation`
    | `pauseConversation`
    | `resumeConversation`
    | `injectMessage`;

export type EventTypes =
    | `start-conversation`
    | `break-conversation`
    | `pause-conversation`
    | `resume-conversation`
    | `inject-message`;

export type EventPayload = {
    bot_name?: string,
    speaker_id: number,
    prompt: string,
}
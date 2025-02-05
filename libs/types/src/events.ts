export type EventKeys =
    | `startConversation`
    | `breakConversation`
    | `pauseConversation`
    | `resumeConversation`;

export type EventTypes =
    | `start-conversation`
    | `break-conversation`
    | `pause-conversation`
    | `resume-conversation`;

export type EventPayload = {
    bot_name?: string,
    speaker_id: number,
    prompt: string,

}
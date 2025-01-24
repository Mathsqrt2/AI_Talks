export interface Speaker {

    initializeConversation(message: string): Promise<void>;
    respond(message: string): Promise<void>;

}

export type BotResponse = {
    responder: `speaker1` | `speaker2`;
    message: string;
}

export type BotInitPayload = {
    message: string;
}
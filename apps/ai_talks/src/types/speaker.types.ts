export interface Speaker {

    initializeConversation(message: string): Promise<void>;
    respondTo(message: string): Promise<void>;

}

export type Responder = `speaker1` | `speaker2`;

export type BotResponse = {
    responder: Responder;
    message: string;
}

export type BotInitPayload = {
    message: string;
}


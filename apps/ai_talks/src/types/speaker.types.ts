export interface Speaker {
    respondTo(message: string): Promise<string>;
}

export type Responder = `speaker1` | `speaker2`;
export type BotResponse = {
    responder: Responder;
    message: string;
}
export type BotInitPayload = {
    message: string;
}
export type InitProps = { botId: number, message: string }
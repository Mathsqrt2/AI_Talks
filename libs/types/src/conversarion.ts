import { InjectionModeEnum } from "@libs/enums";
import { Message } from "./settings";

export type BodyInitPayload = {
    prompt: string,
}

export type InjectContentPayload = {
    prompt: string,
    mode: InjectionModeEnum
    botId: number,
    username: string,
}

export type MessageEventPayload = {
    message: Message,
}
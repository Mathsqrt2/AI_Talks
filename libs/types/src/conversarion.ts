export type BodyInitPayload = {
    prompt: string,
}

export type InjectContentPayload = {
    prompt: string,
    mode: InjectionMode
    botId: number,
    username: string,
}

export type InjectionMode = `REPLACE` | `MERGE`;
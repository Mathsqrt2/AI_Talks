export type BodyInitPayload = {
    prompt: string,
}

export type InjectContentPayload = {
    prompt: string,
    mode: InjectionMode
    bot_id: number,
    username: string,
}

export type InjectionMode = `REPLACE` | `MERGE`;
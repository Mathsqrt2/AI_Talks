export type JWTPayload = {
    createdAt: string,
    userId: number,
    login: string,
    initializationHash: string,
    payloadGeneratedTime: string,
    payloadUUIDv4: string,
}
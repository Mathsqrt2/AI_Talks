export type JWTPayload = {
    userId: number,
    login: string,
    initializationHash: string,
    createdAt: string,
    payloadGeneratedTime: string,
    payloadUUIDv4: string,
}
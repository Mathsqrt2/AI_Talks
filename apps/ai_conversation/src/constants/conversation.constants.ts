import { EventKeys, EventTypes } from "@libs/types/events";

export const event: Record<EventKeys, EventTypes> = {
    startConversation: "start-conversation",
    breakConversation: "break-conversation",
    resumeConversation: "resume-conversation",
    resetConversation: "reset-conversation",
    injectMessage: "inject-message",
    message: "message",
}
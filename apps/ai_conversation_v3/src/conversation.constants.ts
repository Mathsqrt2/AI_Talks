import { EventKeys, EventTypes } from "@libs/types/events";

export const event: Record<EventKeys, EventTypes> = {
    startConversation: "start-conversation",
    breakConversation: "break-conversation",
    pauseConversation: "pause-conversation",
    resumeConversation: "resume-conversation",
    injectMessage: "inject-message",
}
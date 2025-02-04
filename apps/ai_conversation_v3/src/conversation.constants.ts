import { EventKeys, EventTypes } from "@libs/types/events";
import { QueueType } from "@libs/types/queue";

export const BOT_MESSAGES: QueueType = `BOT_MESSAGES`;
export const USER_MESSAGES: QueueType = `USER_MESSAGES`;
export const event: Record<EventKeys, EventTypes> = {
    startConversation: "start-conversation",
    breakConversation: "break-conversation",
    pauseConversation: "pause-conversation",
    resumeConversation: "resume-conversation",
}
import { Conversation } from "./entities/conversation.entity";
import { Settings } from "./entities/settings.entity";
import { Comment } from "./entities/comment.entity";
import { Message } from "./entities/message.entity";
import { State } from "./entities/state.entity";
import { Log } from "./entities/log.entity";
import { Summary } from "./entities/summary.entity";

export const entities = [
    Comment,
    Conversation,
    Log,
    Message,
    Settings,
    State,
    Summary,
]
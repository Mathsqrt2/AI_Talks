import { DatabaseService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { event } from '../conversation.constants';
import { InjectContentPayload } from '@libs/types/conversarion';
import { Stats } from '@libs/types/settings';

@Injectable()
export class SettingsService {

    constructor(
        private readonly database: DatabaseService,
    ) { }

    public usersMessages: InjectContentPayload[] = [];
    public isConversationInProgres: boolean = false;
    public maxMessagesCount: number = null;
    public maxContextSize: number = null;
    public shouldContinue: boolean = true;
    public shouldNotify: boolean = true;
    public shouldDisplay: boolean = true;
    public shouldLog: boolean = true;
    public initialPrompt: string = process.env.INITIAL_PROMPT;
    public contextPrompt: string = process.env.OLLAMA_PROMPT;
    public stats: Stats = {
        bot_1: {
            messages: 0,
            durationRecords: [],
            totalGenerationTime: 0,
            averageGenerationTime: 0,
        },
        bot_2: {
            messages: 0,
            durationRecords: [],
            totalGenerationTime: 0,
            averageGenerationTime: 0,
        }
    }

    @OnEvent(event.pauseConversation)
    private pauseConversation() {
        this.isConversationInProgres = false;
    }

}
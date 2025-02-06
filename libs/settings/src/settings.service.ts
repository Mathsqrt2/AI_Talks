import { DatabaseService } from '@libs/database';
import { InjectContentPayload } from '@libs/types/conversarion';
import { Stats } from '@libs/types/settings';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {

    constructor(

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
    public currentMessageIndex: number = 0;
    public enqueuedMessage: string;
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

}

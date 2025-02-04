import { DatabaseService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SettingsService {

    constructor(
        private readonly database: DatabaseService,
    ) { }

    public isConversationInProgres: boolean = false;
    public maxMessagesCount: number = null;
    public maxContextSize: number = null;
    public shouldContinue: boolean = true;
    public shouldNotify: boolean = true;
    public shouldDisplay: boolean = true;
    public shouldLog: boolean = true;
    public initialPrompt: string = process.env.INITIAL_PROMPT;
    public contextPrompt: string = process.env.OLLAMA_PROMPT;

}
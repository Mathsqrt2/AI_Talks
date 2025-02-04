import { DatabaseService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SettingsService {

    constructor(
        private readonly database: DatabaseService,
    ) { }

    public isTalkInProgress: boolean = false;
    public MAX_MESSAGES_CONTEXT: number = null;
    public MAX_CONTEXT_SIZE: number = null;
    public SHOULD_CONTINUE: boolean = true;
    public SHOULD_NOTIFY: boolean = true;
    public SHOULD_DISPLAY: boolean = true;
    public SHOULD_LOG: boolean = true;
    public INITIAL_PROMPT: string = process.env.INITIAL_PROMPT;
    public CONTEXT_PROMPT: string = process.env.OLLAMA_PROMPT

}
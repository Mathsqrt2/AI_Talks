import { Controller, Logger, Post } from '@nestjs/common';

@Controller(`settings`)
export class SettingsController {

    private logger: Logger = new Logger(SettingsController.name);

    constructor() {

    }

    @Post(`context`)
    public setContextLength() {
        // set and refresh base context length;
    }

    @Post(`prompt`)
    public setBasePrompt() {
        // set and refresh base prompt;
    }

    @Post(`notifications`)
    public toggleNotifications() {
        // should be messages send to telegram chat?
    }

    @Post(`logs`)
    public toggleLogging() {
        // toggle displaying messages in logs
        // logging message sent status
        // logging message content
        // logging forced actions
    }




}
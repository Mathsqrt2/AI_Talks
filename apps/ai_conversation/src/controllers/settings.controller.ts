import {
    BadRequestException,
    Body, Controller, Get, HttpCode, HttpStatus,
    OnApplicationBootstrap, Param, Post
} from '@nestjs/common';
import { LogMessage } from '../constants/conversation.responses';
import { SettingsService } from '@libs/settings';
import { SettingsFile } from '@libs/types/settings';
import { Logger } from '@libs/logger';

@Controller(`setings`)
export class SettingsController implements OnApplicationBootstrap {

    private localSettings: SettingsFile = null;
    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) { }

    public onApplicationBootstrap() {
        this.settings.app.subscribe((settingsFile: SettingsFile) => {
            this.localSettings = settingsFile;
        })
    }

    private updateSettings = () => this.settings.app.next(this.localSettings);

    @Get()
    @HttpCode(HttpStatus.FOUND)
    public findCurrentSettings() {
        this.logger.log(LogMessage.log.onUserResponseWithConfig());
        return this.localSettings
    }

    @Get(`context`)
    @HttpCode(HttpStatus.FOUND)
    public findCurrentContextLength() {
        this.logger.log(LogMessage.log.onUserResponseWithContext());
        return this.localSettings.maxContextSize;
    }

    @Get([`prompt`, `prompt/:id`])
    @HttpCode(HttpStatus.FOUND)
    public findCurrentPrompt(
        @Param(`id`) id?: number
    ): { prompt: string[] } {

        if (id !== undefined && id !== 0 && id !== 1 && id !== 2 && id !== 3) {
            throw new BadRequestException(LogMessage.error.onFailedToResponseWithPrompt());
        }

        if (id === 0) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`initial`));
            return { prompt: [this.localSettings.prompts.initialPrompt] };
        }

        if (id === 1) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`contextPrompt1`));
            return { prompt: [this.localSettings.prompts.contextPrompt1] };
        }

        if (id === 2) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`contextPrompt2`));
            return { prompt: [this.localSettings.prompts.contextPrompt2] };
        }

        if (id === 3) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`universalContextPrompt`));
            return { prompt: [this.localSettings.prompts.contextPrompt] };
        }

        const prompt: string[] = [];
        for (const key in this.localSettings.prompts) {
            prompt.push(this.localSettings.prompts[key]);
        }

        this.logger.log(LogMessage.log.onUserResponseWithAllPrompts());
        return { prompt }
    }

    @Get(`state`)
    @HttpCode(HttpStatus.FOUND)
    public findCurrentState() {
        return {
            ...this.localSettings.state,
            isConversationInProgress: this.localSettings.isConversationInProgres
        }
    }

    @Get(`state/:param`)
    @HttpCode(HttpStatus.FOUND)
    public findCurrentStateForParam(
        @Param(`param`) param: string,
    ) {

    }

    @Get(`telegram`)
    @HttpCode(HttpStatus.FOUND)
    public findTelegramInvidation() {

    }

    @Get([`model`, `model/:id`])
    @HttpCode(HttpStatus.FOUND)
    public findModelfile() {

    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    public updateSettingsFile() {

    }

    @Post(`context`)
    @HttpCode(HttpStatus.ACCEPTED)
    public setContextLength(
        @Body() body: { context: number },
    ): void {

        if (!body.context) {
            throw new BadRequestException(LogMessage.error.onIncorrectValue(`context`));
        }

        if (Number.isNaN(+body.context)) {
            throw new BadRequestException(LogMessage.error.onNaNError(`context`))
        }

        this.localSettings.maxContextSize = body.context;
        this.updateSettings();

        this.logger.log(LogMessage.log.contextUpdated(body.context));
    }

    @Post(`prompt/:id`)
    @HttpCode(HttpStatus.ACCEPTED)
    public setPrompt(
        @Param(`id`) id: number,
        @Body() body: { prompt: string }
    ): void {

        if (!body.prompt) {
            throw new BadRequestException(LogMessage.error.onInvalidBody());
        }

        this.localSettings.prompts.contextPrompt = body.prompt;
        this.updateSettings();
    }

    @Post(`state`)
    @HttpCode(HttpStatus.ACCEPTED)
    public setState() {

    }

    @Post(`state/:param`)
    @HttpCode(HttpStatus.ACCEPTED)
    public setStateForParam() {

    }


}
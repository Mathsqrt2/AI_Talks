import { ApiBadRequestResponse, ApiFoundResponse } from '@nestjs/swagger';
import { ResponseSettingsDto } from '../dtos/response-settings.dto';
import { SwaggerMessages } from '../constants/swagger.descriptions';
import { ResponsePromptsDto } from '../dtos/response-prompts.dto';
import { LogMessage } from '../constants/conversation.responses';
import { ResponseStateDto } from '../dtos/response-state.dto';
import {
    BadRequestException, Param, Post, HttpStatus,
    Body, Controller, Get, HttpCode,
} from '@nestjs/common';
import { SettingsService } from '@libs/settings';
import { Logger } from '@libs/logger';

@Controller(`settings`)
export class SettingsController {

    constructor(
        private readonly settings: SettingsService,
        private readonly logger: Logger,
    ) { }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findCurrentSettings.ApiFoundResponse(), type: ResponseSettingsDto })
    public findCurrentSettings(): ResponseSettingsDto {
        this.logger.log(LogMessage.log.onUserResponseWithConfig(), { save: true });
        return this.settings.app;
    }

    @Get(`context`)
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findCurrentContextLength.ApiFoundResponse(), type: Number, example: 4096 })
    public findCurrentContextLength() {
        this.logger.log(LogMessage.log.onUserResponseWithContext(), { save: true });
        return this.settings.app.maxContextSize;
    }

    @Get([`prompt`, `prompt/:id`])
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findCurrentPrompt.ApiFoundResponse(), type: ResponsePromptsDto })
    @ApiBadRequestResponse({ description: SwaggerMessages.findCurrentPrompt.ApiBadRequestResponse() })
    public findCurrentPrompt(
        @Param(`id`) id?: number
    ): { prompt: string[] } {

        if (id !== undefined && id !== 0 && id !== 1 && id !== 2 && id !== 3) {
            throw new BadRequestException(LogMessage.error.onFailedToResponseWithPrompt());
        }

        if (id === 0) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`initial`), { save: true });
            return { prompt: [this.settings.app.prompts.initialPrompt] };
        }

        if (id === 1) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`contextPrompt1`), { save: true });
            return { prompt: [this.settings.app.prompts.contextPrompt1] };
        }

        if (id === 2) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`contextPrompt2`), { save: true });
            return { prompt: [this.settings.app.prompts.contextPrompt2] };
        }

        if (id === 3) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`universalContextPrompt`), { save: true });
            return { prompt: [this.settings.app.prompts.contextPrompt] };
        }

        const prompt: string[] = [];
        for (const key in this.settings.app.prompts) {
            prompt.push(this.settings.app.prompts[key]);
        }

        this.logger.log(LogMessage.log.onUserResponseWithAllPrompts(), { save: true });
        return { prompt }
    }

    @Get(`state`)
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: `` })
    public findCurrentState(): ResponseStateDto {
        return {
            ...this.settings.app.state,
            isConversationInProgress: this.settings.app.isConversationInProgres
        }
    }

    @Get(`state/:param`)
    @HttpCode(HttpStatus.FOUND)
    @ApiBadRequestResponse({ description: `` })
    @ApiFoundResponse({ description: `` })
    public findCurrentStateForParam(
        @Param(`param`) param: string,
    ) {

        if (!Object.prototype.hasOwnProperty.call(this.settings.app.state, param)) {
            this.logger.error(LogMessage.error.onUndefinedParam(param), { save: true })
            throw new BadRequestException(LogMessage.error.onUndefinedParam(param));
        }

        this.logger.log(LogMessage.log.onParamResponse(param), { save: true });
        return this.settings.app.state[param];

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
    public async setContextLength(
        @Body() body: { context: number },
    ): Promise<void> {

        if (!body.context) {
            throw new BadRequestException(LogMessage.error.onIncorrectValue(`context`));
        }

        if (Number.isNaN(+body.context)) {
            throw new BadRequestException(LogMessage.error.onNaNError(`context`))
        }

        this.settings.app.maxContextSize = body.context;
        await this.settings.archiveSettings();
        this.logger.log(LogMessage.log.onContextUpdated(body.context), { save: true });
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

        this.settings.app.prompts.contextPrompt = body.prompt;
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
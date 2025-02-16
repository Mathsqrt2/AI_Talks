import {
    BadRequestException, Param, Post,
    Body, Controller, Get, HttpCode, HttpStatus,
} from '@nestjs/common';
import { LogMessage } from '../constants/conversation.responses';
import { ConfigService } from '@libs/settings';
import { Logger } from '@libs/logger';
import { ApiBadRequestResponse, ApiFoundResponse } from '@nestjs/swagger';
import { ResponseSettingsDto } from '../dtos/response-settings.dto';
import { SwaggerMessages } from '../constants/swagger.descriptions';
import { ResponsePromptsDto } from '../dtos/response-prompts.dto';

@Controller(`settings`)
export class SettingsController {

    constructor(
        private readonly settings: ConfigService,
        private readonly logger: Logger,
    ) { }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findCurrentSettings.ApiFoundResponse(), type: ResponseSettingsDto })
    public findCurrentSettings(): ResponseSettingsDto {
        this.logger.log(LogMessage.log.onUserResponseWithConfig());
        return this.settings.app;
    }

    @Get(`context`)
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findCurrentContextLength.ApiFoundResponse(), type: Number, example: 4096 })
    public findCurrentContextLength() {
        this.logger.log(LogMessage.log.onUserResponseWithContext());
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
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`initial`));
            return { prompt: [this.settings.app.prompts.initialPrompt] };
        }

        if (id === 1) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`contextPrompt1`));
            return { prompt: [this.settings.app.prompts.contextPrompt1] };
        }

        if (id === 2) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`contextPrompt2`));
            return { prompt: [this.settings.app.prompts.contextPrompt2] };
        }

        if (id === 3) {
            this.logger.log(LogMessage.log.onUserResponseWithPrompt(`universalContextPrompt`));
            return { prompt: [this.settings.app.prompts.contextPrompt] };
        }

        const prompt: string[] = [];
        for (const key in this.settings.app.prompts) {
            prompt.push(this.settings.app.prompts[key]);
        }

        this.logger.log(LogMessage.log.onUserResponseWithAllPrompts());
        return { prompt }
    }

    @Get(`state`)
    @HttpCode(HttpStatus.FOUND)
    public findCurrentState() {
        return {
            ...this.settings.app.state,
            isConversationInProgress: this.settings.app.isConversationInProgres
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

        this.settings.app.maxContextSize = body.context;
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
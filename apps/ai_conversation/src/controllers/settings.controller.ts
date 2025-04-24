import { ApiAcceptedResponse, ApiBadRequestResponse, ApiFoundResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ResponseStateParamDto } from '../dtos/response-state-param.dto';
import { ResponseSettingsDto } from '../dtos/response-settings.dto';
import { SwaggerMessages } from '../constants/swagger.descriptions';
import { ResponsePromptsDto } from '../dtos/response-prompts.dto';
import { LogMessage } from '../constants/conversation.responses';
import { ResponseStateDto } from '../dtos/response-state.dto';
import {
    BadRequestException, Param, Post, HttpStatus,
    Body, Controller, Get, HttpCode,
    NotFoundException,
} from '@nestjs/common';
import { ModelFileIdDto } from '../dtos/modelfile-id.dto';
import { PromptIdDto } from '../dtos/prompt-id.dto';
import { SettingsService } from '@libs/settings';
import { readFile, readdir } from 'fs/promises';
import { Logger } from '@libs/logger';
import { resolve } from 'path';
import { ResponseInvitationDto } from '../dtos/response-invitation.dto';
import { UpdateSettingsDto } from '../dtos/update-settings.dto';

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
        @Param() { id }: PromptIdDto
    ): { prompt: string | { [key: string]: string } } {

        let responseType: string = ``;
        let output: { prompt: string | { [key: string]: string } };

        if (!id) {
            this.logger.log(LogMessage.log.onUserResponseWithAllPrompts());
            return { prompt: this.settings.app.prompts }
        }

        switch (+id) {
            case 0:
                output = { prompt: this.settings.app.prompts.initialPrompt };
                responseType = `initial`;
                break;
            case 1:
                output = { prompt: this.settings.app.prompts.contextPrompt1 };
                responseType = `contextPrompt1`;
                break;
            case 2:
                output = { prompt: this.settings.app.prompts.contextPrompt2 };
                responseType = `contextPrompt2`;
                break;
            case 3:
                output = { prompt: this.settings.app.prompts.contextPrompt };
                responseType = `universalContextPrompt`;
                break;
            case 4:
                output = { prompt: this.settings.app.prompts.injectorPrompt };
                responseType = `injectorPrompt`;
                break;
            case 5:
                output = { prompt: this.settings.app.prompts.summarizerPrompt };
                responseType = `summarizerPrompt`;
                break;
            default:
                throw new BadRequestException(LogMessage.error.onFailedToResponseWithPrompt())
        }

        this.logger.log(LogMessage.log.onUserResponseWithPrompt(responseType));
        return output;
    }

    @Get(`state`)
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findCurrentState.ApiFoundResponse() })
    public findCurrentState(): ResponseStateDto {
        return {
            ...this.settings.app.state,
            isConversationInProgress: this.settings.app.isConversationInProgres
        }
    }

    @Get(`state/:param`)
    @HttpCode(HttpStatus.FOUND)
    @ApiBadRequestResponse({ description: SwaggerMessages.findSpecifiedParamState.ApiBadRequestResponse() })
    @ApiFoundResponse({ description: SwaggerMessages.findSpecifiedParamState.ApiFoundResponse() })
    public findCurrentStateForParam(
        @Param() { param }: ResponseStateParamDto,
    ) {

        if (!Object.prototype.hasOwnProperty.call(this.settings.app.state, param)) {
            this.logger.error(LogMessage.error.onUndefinedParam(param))
            throw new BadRequestException(LogMessage.error.onUndefinedParam(param));
        }

        this.logger.log(LogMessage.log.onParamResponse(param));
        return this.settings.app.state[param];

    }

    @Get(`telegram`)
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findTelegramInvitation.ApiFoundResponse() })
    public findTelegramInvitation(): ResponseInvitationDto {
        return {
            invitation: process.env.TELEGRAM_INVITATION
        }
    }

    @Get([`model`, `model/:id`])
    @HttpCode(HttpStatus.FOUND)
    @ApiFoundResponse({ description: SwaggerMessages.findModelFile.ApiFoundResponse() })
    @ApiNotFoundResponse({ description: SwaggerMessages.findModelFile.ApiNotFoundResponse() })
    public async findModelfile(
        @Param() { id }: ModelFileIdDto
    ): Promise<{ [key: string]: string }> {

        const output: { [key: string]: string } = {};
        const path: string = resolve(...[__dirname], `..`, `..`, `..`, `modelfiles`);
        const files = await readdir(path);
        const modelFiles: string[] = files
            .filter(modelFile => modelFile.endsWith(`modelfile`))
            .map(modelFile => resolve(path, modelFile));

        if (!modelFiles) {
            throw new NotFoundException(`No modelfiles was found.`);
        }

        if (!id) {
            for (const modelFile of modelFiles) {
                const name = modelFile.split(`.`).at(-3).split(/\/|\\/).pop();
                output[name] = await readFile(modelFile, { encoding: `utf-8` });
            }
            return output;
        }

        let modelFilePath: string = ``
        switch (+id) {
            case 0: modelFilePath = modelFiles.find(modelFile => modelFile.includes(`injector`))
                break;
            case 1: modelFilePath = modelFiles.find(modelFile => modelFile.includes(`speaker`))
                break;
            case 2: modelFilePath = modelFiles.find(modelFile => modelFile.includes(`summarizer`))
                break;
            default:
                throw new NotFoundException(`Specified modelfile doesn't exist.`);
        }

        const name = modelFilePath.split(`.`).at(-3).split(/\/|\\/).pop();
        output[name] = await readFile(modelFilePath, { encoding: `utf-8` });
        return output;

    }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: `` })
    @ApiBadRequestResponse({ description: `` })
    public updateSettingsFile(
        @Body() body: UpdateSettingsDto
    ) {

    }

    @Post(`context`)
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: SwaggerMessages.setContextLength.ApiAcceptedResponse() })
    @ApiBadRequestResponse({ description: SwaggerMessages.setContextLength.ApiBadRequestResponse() })
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
        this.logger.log(LogMessage.log.onContextUpdated(body.context));
    }

    @Post(`prompt/:id`)
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: `` })
    @ApiBadRequestResponse({ description: `` })
    public setPrompt(
        @Body() body: { prompt: string },
        @Param(`id`) id: number,
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
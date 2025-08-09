import { ApiAcceptedResponse, ApiBadRequestResponse, ApiFoundResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import {
  ResponseStateParamDto, ResponseSettingsDto, ResponsePromptsDto, ResponseStateDto,
  ModelFileIdDto, PromptIdDto, ResponseInvitationDto, SetSettingsDto
} from '@libs/dtos';
import { SwaggerMessages, LogMessage } from '@libs/constants';
import {
  BadRequestException, Param, Post, Get, HttpStatus,
  Body, Controller, HttpCode, InternalServerErrorException,
  NotFoundException,
  Patch,
  Put,
} from '@nestjs/common';
import { SettingsService } from '@libs/settings';
import { ModelfilesOutput } from '@libs/types';
import { PromptTypes } from '@libs/enums';
import { readFile } from 'fs/promises';
import { Logger } from '@libs/logger';

@Controller(`api/v1/settings`)
export class SettingsController {

  constructor(
    private readonly settings: SettingsService,
    private readonly logger: Logger,
  ) { }

  @Get()
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: SwaggerMessages.findCurrentSettings.ApiFoundResponse(), type: ResponseSettingsDto })
  public findCurrentSettings(): ResponseSettingsDto {
    const startTime: number = Date.now();
    this.logger.log(LogMessage.log.onUserResponseWithConfig(), { startTime });
    return this.settings.app;
  }

  @Get(`context`)
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: SwaggerMessages.findCurrentContextLength.ApiFoundResponse(), type: Number, example: 4096 })
  public findCurrentContextLength() {
    const startTime: number = Date.now();
    this.logger.log(LogMessage.log.onUserResponseWithContext(), { startTime });
    return this.settings.app.maxContextSize;
  }

  @Get([`prompt`, `prompt/:type`])
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: SwaggerMessages.findCurrentPrompt.ApiFoundResponse(), type: ResponsePromptsDto })
  @ApiBadRequestResponse({ description: SwaggerMessages.findCurrentPrompt.ApiBadRequestResponse() })
  public findCurrentPrompt(
    @Param() { type }: PromptIdDto
  ): { prompt: string | { [key: string]: string } } {

    const startTime: number = Date.now();
    const prompts = this.settings.app.prompts;
    if (!type) {
      this.logger.log(LogMessage.log.onUserResponseWithAllPrompts(), { startTime });
      return { prompt: prompts }
    }

    this.logger.log(LogMessage.log.onUserResponseWithPrompt(type), { startTime });
    switch (type) {
      case PromptTypes.INITIAL: return { prompt: prompts.initialPrompt };
      case PromptTypes.CONTEXT_PROMPT_1: return { prompt: prompts.contextPrompt1 };
      case PromptTypes.CONTEXT_PROMPT_2: return { prompt: prompts.contextPrompt2 };
      case PromptTypes.UNIVERSAL_CONTEXT_PROMPT: return { prompt: prompts.contextPrompt };
      case PromptTypes.INJECTOR_PROMPT: return { prompt: prompts.injectorPrompt };
      case PromptTypes.SUMMARIZER_PROMPT: return { prompt: prompts.summarizerPrompt };
      default:
        throw new BadRequestException(LogMessage.error.onFailedToResponseWithPrompt())
    }
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

    const startTime: number = Date.now();
    if (!Object.prototype.hasOwnProperty.call(this.settings.app.state, param)) {
      this.logger.error(LogMessage.error.onUndefinedParam(param), { startTime })
      throw new BadRequestException(LogMessage.error.onUndefinedParam(param));
    }

    this.logger.log(LogMessage.log.onParamResponse(param), { startTime });
    return this.settings.app.state[param];

  }

  @Get(`telegram`)
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: SwaggerMessages.findTelegramInvitation.ApiFoundResponse() })
  public findTelegramInvitation(): ResponseInvitationDto {

    if (!process.env.TELEGRAM_INVITATION || process.env.TELEGRAM_INVITATION === ``) {
      throw new NotFoundException(`There is not defined telegram invitation.`);
    }

    return { invitation: process.env.TELEGRAM_INVITATION }
  }

  @Get([`model`, `model/:modelfile`])
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: SwaggerMessages.findModelFile.ApiFoundResponse() })
  @ApiNotFoundResponse({ description: SwaggerMessages.findModelFile.ApiNotFoundResponse() })
  public async findModelfile(
    @Param() { modelfile }: ModelFileIdDto
  ): Promise<ModelfilesOutput> {

    const startTime: number = Date.now();
    const modelfileSource = await this.settings.findModelfile(modelfile);
    if (typeof modelfileSource === `object`) {
      return modelfileSource;
    }

    try {
      const name = modelfileSource.split(`.`).at(-3).split(/\/|\\/).pop();
      return { [name]: await readFile(modelfileSource, { encoding: `utf-8` }) };

    } catch (error) {
      this.logger.error(`Failed to access modelfile`, { error, startTime });
      throw new InternalServerErrorException(`Failed to access modelfile ${modelfile}`);
    }

  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.setSettingsFile.ApiAcceptedResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setSettingsFile.ApiBadRequestResponse() })
  public setSettings(
    @Body() body: SetSettingsDto
  ) {

    const startTime: number = Date.now();

  }

  @Post(`:property`)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.setContextLength.ApiAcceptedResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setContextLength.ApiBadRequestResponse() })
  public async setProperty(
    @Body() body: { context: number },
  ): Promise<void> {

    const startTime: number = Date.now();
    if (!body.context) {
      throw new BadRequestException(LogMessage.error.onIncorrectValue(`context`));
    }

    if (Number.isNaN(+body.context)) {
      throw new BadRequestException(LogMessage.error.onNaNError(`context`))
    }

    this.settings.app.maxContextSize = body.context;
    await this.settings.archiveSettings();
    this.logger.log(LogMessage.log.onContextUpdated(body.context), { startTime });
  }

  @Post(`prompt/:id`)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.setPrompt.ApiAcceptedResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setPrompt.ApiBadRequestResponse() })
  public setPrompt(
    @Body() body: { prompt: string },
    @Param(`id`) id: number,
  ): void {

    if (!body.prompt) {
      throw new BadRequestException(LogMessage.error.onInvalidBody());
    }

    this.settings.app.prompts.contextPrompt1 = body.prompt;
  }

  @Post(`state`)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.setState.ApiAcceptedResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setState.ApiBadRequestResponse() })
  public setState(
    @Body() body: {}
  ) {

  }

  @Post(`state/:param`)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.setStateForParam.ApiAcceptedResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setStateForParam.ApiBadRequestResponse() })
  public setStateForParam(
    @Param() { param }: ResponseStateParamDto,
    @Body() body: { value: string | boolean },
  ) {

    const startTime: number = Date.now();
    if (!Object.prototype.hasOwnProperty.call(this.settings.app.state, param)) {
      this.logger.error(LogMessage.error.onUndefinedParam(param), { startTime })
      throw new BadRequestException(LogMessage.error.onUndefinedParam(param));
    }

    this.logger.log(LogMessage.log.onParamResponse(param), { startTime });
  }

  @Patch(``)
  public updateSettings() {

  }

  @Put(``)
  public replace() { }
}
import {
  BadRequestException, Param, Post, Get, HttpStatus, NotFoundException,
  Body, Controller, HttpCode, InternalServerErrorException,
  Put,
  Patch,
} from '@nestjs/common';
import { SwaggerMessages, LogMessage } from '@libs/constants';
import {
  StateParamDto, SettingsDto, PromptsDto, StateDto, PromptDto,
  ModelFileIdDto, InvitationDto, SettingsPropertyDto, SetPromptDto
} from '@libs/dtos';
import {
  ApiAcceptedResponse, ApiBadRequestResponse,
  ApiOkResponse, ApiNotFoundResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';
import { ModelfilesOutput, PromptOutput } from '@libs/types';
import { SettingsService } from '@libs/settings';
import { readFile } from 'fs/promises';
import { Logger } from '@libs/logger';

@Controller(`api/v1/settings`)
export class SettingsController {

  constructor(
    private readonly settings: SettingsService,
    private readonly logger: Logger,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerMessages.findCurrentSettings.ApiOkResponse(), type: SettingsDto })
  public findCurrentSettings(): SettingsDto {
    const startTime: number = Date.now();
    this.logger.log(LogMessage.log.onUserResponseWithConfig(), { startTime });
    return this.settings.app;
  }

  @Get(`context`)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerMessages.findCurrentContextLength.ApiOkResponse(), type: Number, example: 4096 })
  public findCurrentContextLength(): number {
    const startTime: number = Date.now();
    this.logger.log(LogMessage.log.onUserResponseWithContext(), { startTime });
    return this.settings.app.maxContextSize;
  }

  @Get([`prompt`, `prompt/:type`])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerMessages.findCurrentPrompt.ApiOkResponse(), type: PromptsDto })
  @ApiBadRequestResponse({ description: SwaggerMessages.findCurrentPrompt.ApiBadRequestResponse() })
  public findCurrentPrompt(
    @Param() { prompt }: PromptDto
  ): PromptOutput {

    const startTime: number = Date.now();

    if (!prompt) {
      this.logger.log(LogMessage.log.onUserResponseWithAllPrompts(), { startTime });
      return { prompt: this.settings.app.prompts };
    }

    this.logger.log(LogMessage.log.onUserResponseWithPrompt(prompt), { startTime });
    return { prompt: this.settings.app.prompts[prompt] };

  }

  @Get(`state`)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerMessages.findCurrentState.ApiOkResponse() })
  public findCurrentState(): StateDto {
    const startTime: number = Date.now();
    this.logger.log(LogMessage.log.onUserResponseWithState(), { startTime });
    return {
      ...this.settings.app.state,
      isConversationInProgress: this.settings.app.isConversationInProgres
    }
  }

  @Get(`state/:param`)
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: SwaggerMessages.findSpecifiedParamState.ApiBadRequestResponse() })
  @ApiOkResponse({ description: SwaggerMessages.findSpecifiedParamState.ApiOkResponse() })
  public findCurrentStateForParam(
    @Param() { param }: StateParamDto,
  ) {
    const startTime: number = Date.now();
    this.logger.log(LogMessage.log.onParamResponse(param), { startTime });
    return this.settings.app.state[param];
  }

  @Get(`telegram`)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerMessages.findTelegramInvitation.ApiOkResponse() })
  public findTelegramInvitation(): InvitationDto {

    if (!process.env.TELEGRAM_INVITATION || process.env.TELEGRAM_INVITATION === ``) {
      throw new NotFoundException(`There is not defined telegram invitation.`);
    }

    return { invitation: process.env.TELEGRAM_INVITATION }
  }

  @Get([`model`, `model/:modelfile`])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerMessages.findModelFile.ApiOkResponse() })
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

  @Get(`:property`)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: SwaggerMessages.findSpecifiedPropertyState.ApiOkResponse() })
  public findProperty(
    @Param() { property }: SettingsPropertyDto,
  ) {
    const startTime: number = Date.now();
    this.logger.log(LogMessage.log.onPropertyResponse(property), { startTime });
    return this.settings.app[property];
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.setSettingsFile.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setSettingsFile.ApiBadRequestResponse() })
  public setSettings(
    @Body() body: SettingsDto
  ) {
    const startTime: number = Date.now();
    this.settings.app = body;
    this.logger.log(LogMessage.log.onSettingsUpdated(), { startTime });
  }

  @Put(`prompt`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAcceptedResponse({ description: SwaggerMessages.setPrompt.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setPrompt.ApiBadRequestResponse() })
  public setPrompts(
    @Body() prompts: PromptsDto
  ) {
    const startTime: number = Date.now();
    this.settings.app.prompts = prompts;
    this.logger.log(LogMessage.log.onSettingsUpdated(), { startTime });
  }

  @Put(`state`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAcceptedResponse({ description: SwaggerMessages.setState.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setState.ApiBadRequestResponse() })
  public setState(
    @Body() body: StateDto
  ) {
    const startTime: number = Date.now();
    this.settings.app.state = body;
    this.logger.log(LogMessage.log.onSettingsUpdated(), { startTime });
  }

  @Patch(`:param`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.setPropertyValue.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setPropertyValue.ApiBadRequestResponse() })
  public async setProperty(
    @Param() { param }: StateParamDto,
    @Body() body: { context: number },
  ): Promise<void> {

    const startTime: number = Date.now();
    if (!body.context) {
      throw new BadRequestException(LogMessage.error.onIncorrectValue(`context`));
    }

    this.logger.log(LogMessage.log.onContextUpdated(body.context), { startTime });
  }

  @Patch(`prompt/:prompt`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.setPrompt.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setPrompt.ApiBadRequestResponse() })
  public setPrompt(
    @Body() { value }: SetPromptDto,
    @Param() { prompt }: PromptDto,
  ): void {

    const startTime: number = Date.now();
    if (!value) {
      throw new BadRequestException(LogMessage.error.onInvalidBody());
    }

    this.settings.app.prompts[prompt] = value;
    this.logger.log(LogMessage.log.onPromptUpdated(prompt), { startTime });
  }

  @Patch(`state/:param`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.setStateForParam.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setStateForParam.ApiBadRequestResponse() })
  public setStateForParam(
    @Param() { param }: StateParamDto,
    @Body() body: { value: string | boolean },
  ) {

    const startTime: number = Date.now();
    if (!Object.prototype.hasOwnProperty.call(this.settings.app.state, param)) {
      this.logger.error(LogMessage.error.onUndefinedParam(param), { startTime })
      throw new BadRequestException(LogMessage.error.onUndefinedParam(param));
    }

    this.logger.log(LogMessage.log.onParamResponse(param), { startTime });
  }

}
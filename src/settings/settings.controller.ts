import {
  StateParamDto, SettingsDto, PromptsDto, StateDto, PromptDto, PatchPromptsDto,
  ModelFileIdDto, InvitationDto, SettingsPropertyDto, PatchStateDto, PatchPropertyDto,
} from '@libs/dtos';
import { MessageEventPayload, ModelfilesOutput, PromptOutput } from '@libs/types';
import {
  Param, Get, HttpStatus, NotFoundException, Put, Body, Controller,
  HttpCode, InternalServerErrorException, Patch, Delete,
  BadRequestException
} from '@nestjs/common';
import { SwaggerMessages, LogMessage } from '@libs/constants';
import {
  ApiNoContentResponse, ApiNotFoundResponse, ApiAcceptedResponse,
  ApiBadRequestResponse, ApiOkResponse,
} from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SettingsService } from '@libs/settings';
import { EventsEnum } from '@libs/enums';
import { readFile } from 'fs/promises';
import { Logger } from '@libs/logger';

@Controller(`api/v1/settings`)
export class SettingsController {

  constructor(
    private readonly eventEmitter: EventEmitter2,
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
      isConversationInProgresss: this.settings.app.isConversationInProgress
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
      throw new NotFoundException(LogMessage.warn.onEmptyTelegramInvitation());
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
      this.logger.error(LogMessage.error.onFailedToAccessModelfile(modelfile), { error, startTime });
      throw new InternalServerErrorException(LogMessage.error.onFailedToAccessModelfile(modelfile));
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
  public async setSettings(
    @Body() body: SettingsDto
  ): Promise<void> {
    const startTime: number = Date.now();
    this.settings.app = body;
    await this.settings.archiveSettings();
    this.logger.log(LogMessage.log.onSettingsUpdate(), { startTime });
  }

  @Put(`prompt`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.setPrompt.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setPrompt.ApiBadRequestResponse() })
  public async setPrompts(
    @Body() prompts: PromptsDto
  ): Promise<void> {
    const startTime: number = Date.now();
    this.settings.app.prompts = prompts;
    await this.settings.archiveSettings();
    this.logger.log(LogMessage.log.onPromptsUpdate(), { startTime });
  }

  @Put(`state`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.setState.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setState.ApiBadRequestResponse() })
  public async setState(
    @Body() body: StateDto
  ): Promise<void> {
    const startTime: number = Date.now();
    this.settings.app.state = body;
    await this.settings.archiveSettings();
    this.logger.log(LogMessage.log.onStateUpdate(), { startTime });
  }

  @Patch(`state`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.patchState.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.patchState.ApiBadRequestResponse() })
  public async patchState(
    @Body() stateProperties: PatchStateDto
  ): Promise<void> {
    const startTime: number = Date.now();

    if (!stateProperties || Object.keys(stateProperties).length === 0) {
      this.logger.warn(LogMessage.warn.onInvalidFields(`patch state`));
      throw new BadRequestException(LogMessage.warn.onInvalidFields(`patch state`));
    }

    const existingState = structuredClone(this.settings.app.state);
    this.settings.app.state = { ...existingState, ...stateProperties };
    await this.settings.archiveSettings();
    this.logger.log(LogMessage.log.onStatePatched(), { startTime });
  }

  @Patch(`prompt`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.patchPrompts.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.patchPrompts.ApiBadRequestResponse() })
  public async patchPrompts(
    @Body() prompts: PatchPromptsDto
  ): Promise<void> {
    const startTime: number = Date.now();

    if (!prompts || Object.keys(prompts).length === 0) {
      this.logger.warn(LogMessage.warn.onInvalidFields(`patch prompts`));
      throw new BadRequestException(LogMessage.warn.onInvalidFields(`patch prompts`));
    }

    const existingPrompts = structuredClone(this.settings.app.prompts);
    this.settings.app.prompts = { ...existingPrompts, ...prompts };
    await this.settings.archiveSettings();
    this.logger.log(LogMessage.log.onPromptsPatched(), { startTime });
  }

  @Patch(`property`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: SwaggerMessages.setPropertyValue.ApiNoContentResponse() })
  @ApiBadRequestResponse({ description: SwaggerMessages.setPropertyValue.ApiBadRequestResponse() })
  public async setProperty(
    @Body() body: PatchPropertyDto,
  ): Promise<void> {
    const startTime: number = Date.now();

    if (!body || Object.keys(body).length === 0) {
      this.logger.warn(LogMessage.warn.onInvalidFields(`patch property`));
      throw new BadRequestException(LogMessage.warn.onInvalidFields(`patch property`));
    }

    const { state, prompts, ...properties } = body;
    const existingSettings = structuredClone(this.settings.app);

    this.settings.app = { ...existingSettings, ...properties };
    if (state) {
      this.settings.app.state = { ...this.settings.app.state, ...state };
    }

    if (prompts) {
      this.settings.app.prompts = { ...this.settings.app.prompts, ...prompts };
    }

    if (!existingSettings.isConversationInProgress && existingSettings.isConversationInProgress === true) {
      this.settings.app.state.isGeneratingOnAir = false;
      const payload: MessageEventPayload = { message: this.settings.findLastMessage() }
      this.eventEmitter.emit(EventsEnum.message, payload);
      this.logger.log(LogMessage.log.onResumeConversation(), { startTime });
    }
    await this.settings.archiveSettings();
    this.logger.log(LogMessage.log.onPropertiesPatched(Object.keys(body).length), { startTime });
  }

  @Delete(`conversation`)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: SwaggerMessages.deleteConversation.ApiAcceptedResponse() })
  public deleteConversation(): void {
    const startTime: number = Date.now();
    this.settings.app.state.usersMessagesStackForBot1 = [];
    this.settings.app.state.usersMessagesStackForBot2 = [];
    this.settings.app.state.lastBotMessages = [];
    this.settings.app.state.enqueuedMessage = null;
    this.logger.log(LogMessage.log.onConversationHistoryDelete(), { startTime });
  }

}
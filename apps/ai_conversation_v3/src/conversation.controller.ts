import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SettingsService } from './settings/settings.service';
import { Bots } from '@libs/types/telegram';
import { Response } from 'express';
import { BodyInitPayload } from '@libs/types/conversarion';
import { logMessages } from './conversation.responses';
import { event } from './conversation.constants';
import { EventPayload } from '@libs/types/events';

@Controller()
export class ConversationController {


  private readonly logger: Logger = new Logger(`Bot`);
  private lastResponder: Bots = null;

  constructor(
    private readonly settings: SettingsService,
    private readonly eventEmitter: EventEmitter2,
    private readonly service: ConversationService,
  ) { }

  @Post(`init/:id`)
  public async initializeConversation(
    @Param(`id`) id: number,
    @Res() response: Response,
    @Body() body: BodyInitPayload,
  ): Promise<void> {

    if (this.settings.isConversationInProgres) {
      this.logger.error(logMessages.warn.onConversationAlreadyRunning());
      response.sendStatus(HttpStatus.FORBIDDEN);
      return;
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.error(logMessages.error.onIdOutOfRange(id));
      response.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    try {

      this.settings.isConversationInProgres = true;

      const eventPayload: EventPayload = { speaker_id: +id, prompt: body.prompt };
      await this.eventEmitter.emitAsync(event.startConversation, eventPayload);

      this.logger.log(logMessages.log.onConversationStart());
      response.sendStatus(HttpStatus.OK);
      return;

    } catch (error) {

      this.logger.error(logMessages.error.onConversationInitFail);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

  }



}

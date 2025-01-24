import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Speaker1Service } from './speakers/speaker1.service';
import { Speaker2Service } from './speakers/speaker2.service';
import { BotInitPayload } from './types/speaker.types';
import { OnEvent } from '@nestjs/event-emitter';

@Controller()
export class AiTalksController {

  private logger: Logger = new Logger(AiTalksController.name);
  private isTalkInProgres: boolean = false;

  constructor(
    private readonly speaker1: Speaker1Service,
    private readonly speaker2: Speaker2Service,
  ) { }

  @OnEvent(`conversation-break`)
  private pauseConversation() {
    this.logger.debug("odczytano");
    this.isTalkInProgres = false;
  }

  @Get(`/init/:id`)
  @Post(`/init/:id`)
  public async initializeTalksWithMessage(
    @Param(`id`) id: number,
    @Res() response: Response,
    @Body() body: BotInitPayload,
  ): Promise<void> {

    if (this.isTalkInProgres) {
      this.logger.error(`Failed to start new conversation. There is currently running conversation.`);
      response.sendStatus(HttpStatus.FORBIDDEN);
      return;
    }

    if (+id !== 1 && +id !== 2) {
      this.logger.error(`Failed to start conversation. Bot with ID ${id} doesn't exist.`);
      response.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    try {

      if (+id === 1) {
        this.speaker1.initializeConversation(body.message);
      } else if (+id === 2) {
        this.speaker2.initializeConversation(body.message);
      }
      this.isTalkInProgres = true;

    } catch (err) {

      this.logger.error(`Failed to initialize conversation.`)
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR)

      return;
    }

    this.logger.log(`Conversation initialized.`);
    response.sendStatus(HttpStatus.OK);
  }

  @Get(`/break`)
  @Post(`/break`)
  public async breakCurrentTalk(
    @Res() response: Response
  ) {

  }

  @Post(`inject`)
  public async injectMessage(
    @Res() response: Response
  ) {

  }
}

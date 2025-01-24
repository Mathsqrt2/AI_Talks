import { Body, Controller, Logger, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Speaker1Service } from './speakers/speaker1.service';
import { Speaker2Service } from './speakers/speaker2.service';
import { BotInitPayload } from './types/speaker.types';

@Controller()
export class AiTalksController {

  private logger: Logger = new Logger(AiTalksController.name);

  constructor(
    private readonly speaker1: Speaker1Service,
    private readonly speaker2: Speaker2Service,
  ) { }

  @Post(`/initialize/:id`)
  public async initializeTalks(
    @Param(`id`) id: number,
    @Res() response: Response,
    @Body() body: BotInitPayload,
  ): Promise<void> {

    if (id !== 1 && id !== 2) {
      this.logger.error(`Failed to start conversation. Bot ID ${id} doesn't exist.`);
      response.sendStatus(404);
      return;
    }

    try {
      if (id === 1) {
        this.speaker1.initializeConversation(body.message)
      } else if (id === 2) {
        this.speaker2
      }

    } catch (err) {

    }

    this.logger.log(`Conversation initialized.`);
    response.sendStatus(200);
  }

}

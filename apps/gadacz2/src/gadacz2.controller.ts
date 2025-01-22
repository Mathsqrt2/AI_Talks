import { Body, Controller, Post, Res } from '@nestjs/common';
import { Gadacz2Service } from './gadacz2.service';
import { Response } from 'express';

@Controller()
export class Gadacz2Controller {

  constructor(
    private readonly gadacz2Service: Gadacz2Service,
  ) { }

  @Post('init')
  public async initConversation(
    @Body() body: { prompt: string },
    @Res() response: Response,
  ): Promise<void> {
    this.gadacz2Service.displayContext();
    response.sendStatus(200);
  }

  @Post('listen')
  public async listenYourFriend(
    @Body() body: { prompt: string },
    @Res() response: Response,
  ): Promise<void> {

    this.gadacz2Service.prompt(body.prompt);
    response.sendStatus(200);
  }
}

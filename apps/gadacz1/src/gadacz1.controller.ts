import { Body, Controller, Post, Res } from '@nestjs/common';
import { Gadacz1Service } from './gadacz1.service';
import { Response } from 'express';

@Controller()
export class Gadacz1Controller {

  constructor(
    private readonly gadacz1Service: Gadacz1Service,
  ) { }

  @Post('listen')
  public async listenYourFriend(
    @Body() body: { prompt: string },
    @Res() response: Response,
  ): Promise<void> {

    await this.gadacz1Service.prompt(body.prompt);
    response.sendStatus(200);
  }
}

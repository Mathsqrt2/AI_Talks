import { Body, Controller, Post } from '@nestjs/common';
import { Gadacz1Service } from './gadacz1.service';

@Controller()
export class Gadacz1Controller {

  constructor(
    private readonly gadacz1Service: Gadacz1Service,
  ) { }

  @Post('listen')
  public async listenYourFriend(
    @Body() body: { prompt: string }
  ) {
    return await this.gadacz1Service.prompt(body.prompt);
  }

}

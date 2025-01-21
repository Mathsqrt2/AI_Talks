import { Body, Controller, Post } from '@nestjs/common';
import { Gadacz2Service } from './gadacz2.service';

@Controller()
export class Gadacz2Controller {

  constructor(
    private readonly gadacz1Service: Gadacz2Service,
  ) { }

  @Post('listen')
  public async listenYourFriend(
    @Body() body: { prompt: string }
  ) {
    return await this.gadacz1Service.prompt(body.prompt);
  }

}

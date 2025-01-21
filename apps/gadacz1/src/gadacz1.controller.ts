import { Controller, Get, Post } from '@nestjs/common';
import { Gadacz1Service } from './gadacz1.service';

@Controller()
export class Gadacz1Controller {

  constructor(
    private readonly gadacz1Service: Gadacz1Service
  ) { }

  @Post('sluchaj')
  public listenYourFriend() {

  }

}

import { Controller, Get } from '@nestjs/common';
import { Gadacz2Service } from './gadacz2.service';

@Controller()
export class Gadacz2Controller {
  constructor(private readonly gadacz2Service: Gadacz2Service) {}

  @Get()
  getHello(): string {
    return this.gadacz2Service.getHello();
  }
}

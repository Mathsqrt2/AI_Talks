import { Injectable } from '@nestjs/common';

@Injectable()
export class Gadacz2Service {
  getHello(): string {
    return 'Hello World!';
  }
}

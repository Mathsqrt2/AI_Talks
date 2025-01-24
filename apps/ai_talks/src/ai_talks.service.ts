import { Injectable } from '@nestjs/common';

@Injectable()
export class AiTalksService {
  getHello(): string {
    return 'Hello World!';
  }
}

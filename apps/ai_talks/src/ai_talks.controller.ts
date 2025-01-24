import { Controller } from '@nestjs/common';
import { AiTalksService } from './ai_talks.service';

@Controller()
export class AiTalksController {
  constructor(private readonly aiTalksService: AiTalksService) { }

}

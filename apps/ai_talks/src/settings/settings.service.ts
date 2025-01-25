import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SettingsService {

    private logger: Logger = new Logger(SettingsService.name);

    constructor() { }

}
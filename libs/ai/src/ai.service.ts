import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {

    constructor() { }

    public mergeMessages = async (message: string): Promise<string> => {
        return ``;
    }

}

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';
import { first, firstValueFrom } from 'rxjs';

@Injectable()
export class Gadacz2Service implements OnModuleInit {

  private readonly logger: Logger = new Logger(Gadacz2Service.name);
  private ollama: Ollama = new Ollama();
  private readonly maxContextSize: number = 1024;
  private index: number = 0;

  constructor(
    private readonly http: HttpService,
  ) { }

  async onModuleInit() {
    await this.ollama.setModel('gemma2:9b');
    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT);
    this.logger.log("Gadacz2 ready to talk.");
  }

  private trimContext(context: number[]) {
    while (context.join(' ').length > this.maxContextSize) {
      context.shift();
    }
    return context;
  }

  public prompt = async (prompt: string): Promise<void> => {
    const response = await this.ollama.generate(prompt);
    this.ollama.setContext(this.trimContext(response.stats.context));

    const newResponse = response.output.toString().replaceAll('\n', "");
    console.log(this.index++ + ") " + newResponse);

    await firstValueFrom(this.http.post(process.env.HOST1, { prompt: newResponse }).pipe(first()));
  }

}

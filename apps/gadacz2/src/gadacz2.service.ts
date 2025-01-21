import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';
import { BehaviorSubject, first, firstValueFrom } from 'rxjs';

@Injectable()
export class Gadacz2Service implements OnModuleInit {

  private readonly logger: Logger = new Logger(Gadacz2Service.name);
  private response: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private ollama: Ollama = new Ollama();

  constructor(
    private readonly http: HttpService,
  ) { }

  async onModuleInit() {
    await this.ollama.setModel('gemma2:9b');
    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT);

    this.response.subscribe(async (response: string) => {

      this.logger.log(response);
      await firstValueFrom(this.http.post(process.env.HOST1,
        { prompt: response },
        { withCredentials: true }).pipe(first()))

    });

    const firstAnswer: string = await firstValueFrom(this.http.post<string>(process.env.HOST1,
      { prompt: process.env.INITIAL_PROMPT },
      { withCredentials: true }).pipe(first())) as string;

    this.response.next(firstAnswer);
    this.logger.log("Gadacz2 ready to talk.");
  }

  public prompt = async (prompt: string) => {
    const response = await this.ollama.generate(prompt);
    this.ollama.setContext(response.stats.context);

    return response.output;
  }

}

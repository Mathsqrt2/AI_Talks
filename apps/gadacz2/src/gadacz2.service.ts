import * as TelegramBot from "node-telegram-bot-api";
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';
import { first, firstValueFrom } from "rxjs";

@Injectable()
export class Gadacz2Service implements OnModuleInit {

  private readonly logger: Logger = new Logger(Gadacz2Service.name);
  private context: number[] = [];
  private bot: TelegramBot;
  private ollama: Ollama = new Ollama();
  private readonly maxContextSize: number = 1024;
  private index: number = 0;

  constructor(
    private readonly http: HttpService,
  ) { }

  public displayContext = async (prompt: string): Promise<void> => {
    await this.bot.sendMessage(process.env.GROUP_CHAT_ID, prompt);
    await firstValueFrom(this.http.post(process.env.HOST1, { prompt }).pipe(first()));
  }

  async onModuleInit() {
    this.bot = new TelegramBot(process.env.TOKEN2, { polling: true });
    await this.ollama.setModel('gemma2:9b');

    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT1);
    this.logger.log("Gadacz2 ready to talk.");
  }

  private trimContext(context: number[]) {
    while (context.join(' ').length > this.maxContextSize) {
      context.shift();
    }
    return context;
  }

  public prompt = async (prompt: string): Promise<void> => {

    try {
      const time = Date.now();
      this.logger.log(`Rozpoczynam generowanie odpowiedzi ${this.index}.`);

      const response = await this.ollama.generate(prompt);
      this.context.push(...response.stats.context);
      this.context = this.trimContext(this.context);
      this.ollama.setContext(this.context);

      const newResponse = response.output.toString().replaceAll('\n', "");
      this.bot.sendMessage(process.env.GROUP_CHAT_ID, newResponse);

      await firstValueFrom(this.http.post(process.env.HOST1, { prompt: newResponse }).pipe(first()));
      this.logger.log(`Zakończyłem generowanie odpowiedzi ${this.index++}. Czas trwania (${Date.now() - time})`)
    } catch (err) {
      this.logger.error(`Przepełniony kontekst`);
    }
  }

}

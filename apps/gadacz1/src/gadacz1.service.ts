import * as TelegramBot from "node-telegram-bot-api";
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Ollama } from 'ollama-node';
import { first, firstValueFrom } from "rxjs";

@Injectable()
export class Gadacz1Service implements OnModuleInit {

  private readonly logger: Logger = new Logger(Gadacz1Service.name);
  private context: number[] = [];
  private bot: TelegramBot;
  private readonly maxContextSize: number = 768;
  private ollama: Ollama = new Ollama();
  private index: number = 0;
  private lastPrompt: string = ``;

  constructor(
    private readonly http: HttpService,
  ) { }

  public displayContext = async (): Promise<void> => {
    const spacer = `-----------------RESET PROMPTA-----------------`;
    await this.bot.sendMessage(process.env.GROUP_CHAT_ID, spacer)
    await this.bot.sendMessage(process.env.GROUP_CHAT_ID, process.env.INITIAL_PROMPT);
    await this.http.axiosRef.post(process.env.HOST1, { prompt: process.env.INITIAL_PROMPT });
  }

  async onModuleInit() {
    this.bot = new TelegramBot(process.env.TOKEN1, { polling: true });
    await this.ollama.setModel('gemma2:9b');

    this.ollama.setSystemPrompt(process.env.OLLAMA_PROMPT);
    this.logger.log("Gadacz1 ready to talk.");
  }

  private trimContext(context: number[]) {
    while (context.join(' ').length > this.maxContextSize) {
      context.shift();
    }
    return context;
  }

  public prompt = async (prompt: string): Promise<void> => {

    const time = Date.now();
    this.logger.log(`Rozpoczynam generowanie odpowiedzi ${this.index}.`);
    this.lastPrompt = prompt;

    try {
      this.ollama.setContext(this.trimContext([...this.context]));
      const response = await this.ollama.generate(prompt);
      this.context.push(...response.stats.context);
      this.context = this.trimContext(this.context);

      const newResponse = response.output.toString().replaceAll('\n', "");
      await this.bot.sendMessage(process.env.GROUP_CHAT_ID, newResponse);

      await this.http.axiosRef.post(process.env.HOST2, { prompt: newResponse });
    } catch (err) {
      this.logger.error(`Przepełniony kontekst`);
      await this.http.axiosRef.post(process.env.HOST1, { prompt: this.lastPrompt });
    }

    this.logger.log(`Zakończyłem generowanie odpowiedzi ${this.index++}. Czas trwania (${Date.now() - time})`)
  }

}
